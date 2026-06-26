import { z } from "zod"
import { VIRAL_ACTION_REWARDS, type ViralActionType } from "@/lib/trial/types"

const viralActionTypeValues = Object.keys(
  VIRAL_ACTION_REWARDS
) as [ViralActionType, ...ViralActionType[]]

export const trialExtendSchema = z.object({
  actionType: z.enum(viralActionTypeValues, {
    message: "Invalid action type",
  }),
})

export function isViralActionType(value: string): value is ViralActionType {
  return value in VIRAL_ACTION_REWARDS
}
