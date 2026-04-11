/**
 * Server-side constants for fees module.
 */

export const FEES_API_BASE = "/api/fees";
export const PAYMENTS_API_BASE = "/api/payments";

/**
 * Roles that can access fees module.
 */
export const FEES_ALLOWED_ROLES = ["admin", "student"] as const;

/**
 * Roles that can view ALL students' fees.
 */
export const FEES_ADMIN_ROLES = ["admin"] as const;

/**
 * Currency: INR (smallest unit: paisa)
 */
export const CURRENCY = "INR";
export const CURRENCY_SYMBOL = "₹";
export const SMALLEST_UNIT = "paisa";
export const PAISA_PER_UNIT = 100; // 1 rupee = 100 paisa
