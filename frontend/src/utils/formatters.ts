// src/utils/formatters.ts

/**
 * Formats a date into a readable string format
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions to customize the format
 * @returns A formatted date string
 */
export const formatDate = (
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  ): string => {
    // If date is a string or number, convert it to a Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Format the date using Intl.DateTimeFormat for localization support
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
  };
  
  /**
   * Formats a date to show how long ago it was (e.g. "2 days ago")
   * @param date - The date to format
   * @returns A string representing the relative time
   */
  export const formatRelativeTime = (date: Date | string | number): string => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // More than a week, use regular date format
    return formatDate(dateObj);
  };
  
  /**
   * Truncates text to a specified length and adds ellipsis if needed
   * @param text - The text to truncate
   * @param maxLength - Maximum length before truncation
   * @returns The truncated text with ellipsis if needed
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    
    // Find the last space within the maxLength to avoid cutting words
    const lastSpaceIndex = text.substring(0, maxLength).lastIndexOf(' ');
    
    // If no space found or it's too close to the beginning, just cut at maxLength
    const cutoffIndex = lastSpaceIndex > maxLength * 0.75 ? lastSpaceIndex : maxLength;
    
    return `${text.substring(0, cutoffIndex)}...`;
  };
  
  /**
   * Formats a number as a currency
   * @param amount - The number to format
   * @param currency - The currency code (default: 'USD')
   * @returns A formatted currency string
   */
  export const formatCurrency = (
    amount: number,
    currency: string = 'USD'
  ): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  /**
   * Formats a number for display (e.g. adding commas for thousands)
   * @param number - The number to format
   * @param decimals - Number of decimal places to show
   * @returns A formatted number string
   */
  export const formatNumber = (
    number: number,
    decimals: number = 0
  ): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  };
  
  /**
   * Formats a rating (e.g. "4.5/5")
   * @param rating - The rating value
   * @param maxRating - The maximum possible rating
   * @returns A formatted rating string
   */
  export const formatRating = (
    rating: number,
    maxRating: number = 5
  ): string => {
    return `${rating.toFixed(1)}/${maxRating}`;
  };