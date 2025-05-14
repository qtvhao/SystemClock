// src/SystemClock/Domain/Events/FiveMinuteTickOccurredEvent.ts

import { FiveMinuteWindow } from '../ValueObjects/FiveMinuteWindow';

export class FiveMinuteTickOccurredEvent {
  public readonly occurredOn: Date;
  public readonly window: FiveMinuteWindow;

  constructor(window: FiveMinuteWindow, occurredOn?: Date) {
    this.window = window;
    this.occurredOn = occurredOn ? new Date(occurredOn) : new Date();
  }

  public getAggregateId(): string {
    // This is a temporal event; an identifier could be based on the window
    return this.window.toString();
  }

  public toPrimitives(): Record<string, any> {
    return {
      occurredOn: this.occurredOn.toISOString(),
      windowStart: this.window.getStart().toISOString(),
      windowEnd: this.window.getEnd().toISOString(),
    };
  }
}
