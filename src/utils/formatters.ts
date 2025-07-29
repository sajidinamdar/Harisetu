/**
 * Utility functions for formatting data
 */

/**
 * Format a service type string into a human-readable format
 * @param type The service type string (e.g., "supply_store")
 * @returns A formatted string (e.g., "Supply Store")
 */
export function formatServiceType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format a date string into a localized date format
 * @param dateString The date string to format
 * @returns A formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a price number into a currency string
 * @param price The price to format
 * @returns A formatted price string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
}