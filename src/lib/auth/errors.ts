import type { AuthError } from "@supabase/supabase-js"

export function getAuthErrorMessage(error: AuthError): string {
  const message = error.message.toLowerCase()

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid email or password")
  ) {
    return "Invalid login credentials. Check your email and password."
  }

  if (
    message.includes("user already registered") ||
    message.includes("already been registered") ||
    message.includes("already exists")
  ) {
    return "An account with this email already exists. Try signing in instead."
  }

  if (
    message.includes("password") &&
    (message.includes("at least") || message.includes("6"))
  ) {
    return "Password should be at least 6 characters."
  }

  if (message.includes("valid email")) {
    return "Please enter a valid email address."
  }

  if (message.includes("email not confirmed")) {
    return "Please confirm your email before signing in."
  }

  if (
    message.includes("same password") ||
    message.includes("different from the old")
  ) {
    return "Choose a new password that is different from your current one."
  }

  if (
    message.includes("expired") ||
    (message.includes("invalid") && message.includes("token"))
  ) {
    return "This reset link has expired. Request a new password reset email."
  }

  if (message.includes("username is already taken")) {
    return "That username is already taken. Try another one."
  }

  if (message.includes("username must be")) {
    return error.message
  }

  return error.message
}
