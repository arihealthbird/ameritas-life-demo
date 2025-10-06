export const getUserDisplayName = (authUser: any | null): string => {
  if (!authUser) return ""

  // Try to get the name from metadata if available
  const name = authUser.user_metadata?.name
  if (name) return name

  // Fall back to email, and get the part before @ sign
  const email = authUser.email
  if (email) {
    return email.split("@")[0]
  }

  return "User"
}

export const getUserInitials = (displayName: string): string => {
  return displayName.substring(0, 2).toUpperCase()
}
