/**
 * Error logging utility for centralized error handling and reporting
 * Provides structured error logging with context and severity levels
 */

export interface ErrorContext {
  component?: string;
  function?: string;
  userId?: string;
  sessionId?: string;
  [key: string]: any;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface LoggedError {
  message: string;
  error: Error | unknown;
  context: ErrorContext;
  severity: ErrorSeverity;
  timestamp: Date;
  stack?: string;
}

class ErrorLogger {
  private errors: LoggedError[] = [];
  private maxErrors = 100; // Keep only last 100 errors in memory

  /**
   * Log an error with context and severity
   * @param message - Human readable error message
   * @param error - The actual error object
   * @param context - Additional context about where the error occurred
   * @param severity - How critical this error is
   */
  logError(
    message: string,
    error: Error | unknown,
    context: ErrorContext = {},
    severity: ErrorSeverity = 'medium'
  ): void {
    const loggedError: LoggedError = {
      message,
      error,
      context,
      severity,
      timestamp: new Date(),
      stack: error instanceof Error ? error.stack : undefined,
    };

    // Add to in-memory store
    this.errors.push(loggedError);

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (__DEV__) {
      console.error(`[${severity.toUpperCase()}] ${message}`, {
        error,
        context,
        timestamp: loggedError.timestamp,
      });
    }

    // TODO: In production, send to external service (Sentry, Crashlytics, etc.)
    this.sendToExternalService(loggedError);
  }

  /**
   * Log a warning (non-critical issue)
   */
  logWarning(message: string, context: ErrorContext = {}): void {
    this.logError(message, new Error(message), context, 'low');
  }

  /**
   * Log a critical error that might crash the app
   */
  logCritical(
    message: string,
    error: Error | unknown,
    context: ErrorContext = {}
  ): void {
    this.logError(message, error, context, 'critical');
  }

  /**
   * Get all logged errors (for debugging)
   */
  getErrors(): LoggedError[] {
    return [...this.errors];
  }

  /**
   * Clear all logged errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): LoggedError[] {
    return this.errors.filter((error) => error.severity === severity);
  }

  /**
   * Send error to external service (placeholder for production)
   */
  private sendToExternalService(loggedError: LoggedError): void {
    // TODO: Implement actual external service integration
    // Examples:
    // - Sentry.captureException(loggedError.error, { extra: loggedError.context });
    // - Crashlytics.recordError(loggedError.error);
    // - Custom analytics service

    if (__DEV__) {
      console.log('Would send to external service:', {
        message: loggedError.message,
        severity: loggedError.severity,
        context: loggedError.context,
      });
    }
  }

  /**
   * Create a user-friendly error message for display
   */
  getUserFriendlyMessage(error: Error | unknown): string {
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('Network')) {
        return 'Please check your internet connection and try again.';
      }
      if (error.message.includes('Storage')) {
        return 'There was an issue saving your data. Please try again.';
      }
      if (error.message.includes('Permission')) {
        return 'Please grant the necessary permissions to continue.';
      }
    }

    // Generic fallback
    return 'Something went wrong. Please try again.';
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

// Export the class for testing
export { ErrorLogger };
