import type { SupabaseClient } from "@supabase/supabase-js"
import type { AccountStatus, TrialCheckResult, TrialRecord } from "@/lib/trial/types"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

type TrialUserRow = {
  account_status: string | null
  trial_start_at: string | null
  trial_end_at: string | null
  trial_extended_days: number | null
}

type TrialStatusRpcRow = {
  account_status: string
  trial_start_at: string | null
  trial_end_at: string | null
  trial_extended_days: number
  is_valid: boolean
  days_remaining: number
}

function normalizeAccountStatus(value: string | null | undefined): AccountStatus {
  if (
    value === "trial" ||
    value === "active" ||
    value === "past_due" ||
    value === "canceled"
  ) {
    return value
  }

  return "trial"
}

function toTrialRecord(row: TrialUserRow): TrialRecord {
  return {
    accountStatus: normalizeAccountStatus(row.account_status),
    trialStartAt: row.trial_start_at,
    trialEndAt: row.trial_end_at,
    trialExtendedDays: row.trial_extended_days ?? 0,
  }
}

function computeTrialCheck(record: TrialRecord, now = new Date()): TrialCheckResult {
  if (record.accountStatus === "active") {
    return {
      isValid: true,
      daysRemaining: 0,
      accountStatus: record.accountStatus,
      trialEndAt: record.trialEndAt,
      trialStartAt: record.trialStartAt,
      trialExtendedDays: record.trialExtendedDays,
    }
  }

  if (!record.trialEndAt) {
    return {
      isValid: false,
      daysRemaining: 0,
      accountStatus: record.accountStatus,
      trialEndAt: null,
      trialStartAt: record.trialStartAt,
      trialExtendedDays: record.trialExtendedDays,
    }
  }

  const trialEnd = new Date(record.trialEndAt)
  const msRemaining = trialEnd.getTime() - now.getTime()
  const daysRemaining =
    msRemaining <= 0 ? 0 : Math.ceil(msRemaining / (1000 * 60 * 60 * 24))

  const isTrialActive =
    record.accountStatus === "trial" && trialEnd.getTime() > now.getTime()

  return {
    isValid: isTrialActive,
    daysRemaining,
    accountStatus: record.accountStatus,
    trialEndAt: record.trialEndAt,
    trialStartAt: record.trialStartAt,
    trialExtendedDays: record.trialExtendedDays,
  }
}

async function fetchTrialRow(
  supabase: SupabaseClient,
  userId: string
): Promise<TrialUserRow | null> {
  const { data, error } = await supabase
    .from("users")
    .select(
      "account_status, trial_start_at, trial_end_at, trial_extended_days"
    )
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

async function fetchTrialStatusViaRpc(
  userId: string
): Promise<TrialCheckResult | null> {
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase.rpc("get_trial_status", {
    p_user_id: userId,
  })

  if (error) {
    const rpcMissing =
      error.message.includes("Could not find the function") ||
      error.message.includes("get_trial_status")

    if (rpcMissing) {
      return null
    }

    throw error
  }

  const row = (Array.isArray(data) ? data[0] : data) as
    | TrialStatusRpcRow
    | undefined

  if (!row) {
    return null
  }

  return {
    isValid: row.is_valid,
    daysRemaining: row.days_remaining,
    accountStatus: normalizeAccountStatus(row.account_status),
    trialEndAt: row.trial_end_at,
    trialStartAt: row.trial_start_at,
    trialExtendedDays: row.trial_extended_days,
  }
}

/**
 * Server-side trial gate for middleware, route handlers, and server actions.
 * Paid users (`account_status = active`) always pass.
 */
export async function checkTrialStatus(
  userId: string,
  options?: { supabase?: SupabaseClient }
): Promise<TrialCheckResult> {
  const rpcResult = await fetchTrialStatusViaRpc(userId)
  if (rpcResult) {
    return rpcResult
  }

  const supabase = options?.supabase ?? createAdminSupabaseClient()
  const row = await fetchTrialRow(supabase, userId)

  if (!row) {
    return {
      isValid: false,
      daysRemaining: 0,
      accountStatus: "trial",
      trialEndAt: null,
      trialStartAt: null,
      trialExtendedDays: 0,
    }
  }

  return computeTrialCheck(toTrialRecord(row))
}

export async function getTrialRecord(
  userId: string,
  options?: { supabase?: SupabaseClient }
): Promise<TrialRecord | null> {
  const supabase = options?.supabase ?? createAdminSupabaseClient()
  const row = await fetchTrialRow(supabase, userId)
  return row ? toTrialRecord(row) : null
}

export function isTrialCurrentlyValid(
  record: TrialRecord,
  now = new Date()
): boolean {
  return computeTrialCheck(record, now).isValid
}
