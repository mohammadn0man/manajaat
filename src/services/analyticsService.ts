/**
 * Analytics service for tracking user interactions and events
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  /**
   * Log an analytics event
   */
  logEvent(event: string, properties?: Record<string, unknown>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);

    // In a real app, you would send this to your analytics provider
    // console.log('Analytics Event:', analyticsEvent);
  }

  /**
   * Log dua view event
   */
  logDuaView(duaId: string, index: number, total: number): void {
    this.logEvent('dua_view', {
      id: duaId,
      index: index + 1, // 1-based for analytics
      total,
    });
  }

  /**
   * Log dua navigation event
   */
  logDuaNavigated(fromIndex: number, toIndex: number): void {
    this.logEvent('dua_navigated', {
      fromIndex: fromIndex + 1, // 1-based for analytics
      toIndex: toIndex + 1,
    });
  }

  /**
   * Log session completion event
   */
  logSessionCompleted(
    date: string,
    total: number,
    durationSeconds?: number
  ): void {
    this.logEvent('session_completed', {
      date,
      total,
      durationSeconds,
    });
  }

  /**
   * Log dua view duration (optional)
   */
  logDuaViewDuration(duaId: string, durationSeconds: number): void {
    this.logEvent('dua_view_duration', {
      id: duaId,
      durationSeconds,
    });
  }

  /**
   * Get all events (for debugging)
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clear all events (for testing)
   */
  clearEvents(): void {
    this.events = [];
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
