import { IDomainEvent } from 'contracts.ts';
import { ClockId } from '../ValueObjects/ClockId';

export class FiveMinuteTickOccurredEvent implements IDomainEvent {
  public readonly occurredOn: Date;
  __brand: 'DomainEvent' = 'DomainEvent'

  constructor(public readonly aggregateId: string, public readonly clockId: ClockId) {
    this.occurredOn = new Date();
  }

  public getAggregateId(): string {
    return this.clockId.toString();
  }
eventName(): string {
  return 'systemClock.fiveMinuteTickOccurred';
}

version(): number {
  return 1;
}
}