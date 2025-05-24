export interface FiveMinuteTickPublisherContract {
  /**
   * Starts the ticking mechanism.
   * Triggers an event immediately on startup, then every 5 minutes.
   */
  start(): void;
}
