// src/SystemClock/Infrastructure/Messaging/InMemoryFiveMinuteTickPublisher.ts

import { FiveMinuteTickPublisherContract } from '../../Domain/Contracts/FiveMinuteTickPublisherContract';
import { FiveMinuteTickOccurredEvent } from '../../Domain/Events/FiveMinuteTickOccurredEvent';

export class InMemoryFiveMinuteTickPublisher implements FiveMinuteTickPublisherContract {
  private readonly publishedEvents: FiveMinuteTickOccurredEvent[] = [];

  public async publish(event: FiveMinuteTickOccurredEvent): Promise<void> {
    this.publishedEvents.push(event);
    // Simulate publication (e.g., logging)
    console.log('Published FiveMinuteTickOccurredEvent:', event.toPrimitives());
  }

  public getPublishedEvents(): ReadonlyArray<FiveMinuteTickOccurredEvent> {
    return this.publishedEvents;
  }
}
