/**
 * Environment-aware logging utility
 * Only logs in development mode, can be extended for production error tracking
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Log error messages
   * In development: console.error
   * In production: can be extended to send to error tracking service (Sentry, etc.)
   */
  error: (message: string, error?: Error | unknown) => {
    if (isDevelopment) {
      console.error(message, error);
    }
    // TODO: In production, send to error tracking service
    // Example: Sentry.captureException(error, { extra: { message } });
  },

  /**
   * Log warning messages
   * Only logs in development mode
   */
  warn: (message: string, context?: unknown) => {
    if (isDevelopment) {
      console.warn(message, context);
    }
  },

  /**
   * Log info messages
   * Only logs in development mode
   */
  info: (message: string, context?: unknown) => {
    if (isDevelopment) {
      console.log(message, context);
    }
  },

  /**
   * Log debug messages
   * Only logs in development mode
   */
  debug: (message: string, context?: unknown) => {
    if (isDevelopment) {
      console.debug(message, context);
    }
  },
};
