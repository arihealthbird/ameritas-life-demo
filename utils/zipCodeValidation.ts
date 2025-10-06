// Florida ZIP code ranges
const FLORIDA_ZIP_RANGES = [
  { min: 32000, max: 34999 }, // Main Florida ZIP range
  { min: 30000, max: 31999 }, // Some northern Florida ZIPs may fall in this range
]

// List of supported states (currently only Florida)
export const SUPPORTED_STATES = ["FL"]

/**
 * Checks if a ZIP code is in Florida
 * @param zipCode The ZIP code to check
 * @returns Boolean indicating if the ZIP code is in Florida
 */
export function isFloridaZipCode(zipCode: string): boolean {
  // Ensure ZIP code is a 5-digit number
  if (!/^\d{5}$/.test(zipCode)) {
    return false
  }

  const numericZip = Number.parseInt(zipCode, 10)

  // Check if the ZIP code falls within any of the Florida ranges
  return FLORIDA_ZIP_RANGES.some((range) => numericZip >= range.min && numericZip <= range.max)
}

/**
 * Validates if a ZIP code is in a supported state
 * @param zipCode The ZIP code to validate
 * @returns Boolean indicating if the ZIP code is supported
 */
export function isZipCodeSupported(zipCode: string): boolean {
  // Currently, only Florida is supported
  return isFloridaZipCode(zipCode)
}
