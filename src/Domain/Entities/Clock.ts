import { FiveMinuteTickOccurredEvent } from '../Events/FiveMinuteTickOccurredEvent';
import { ClockId } from '../ValueObjects/ClockId';

export class Clock {
  private domainEvents: FiveMinuteTickOccurredEvent[] = [];

  constructor(private readonly clockId: ClockId) {}

  public tick(): void {
    const event = new FiveMinuteTickOccurredEvent(this.clockId.toString(), this.clockId);
    this.domainEvents.push(event);
  }

  public pullDomainEvents(): FiveMinuteTickOccurredEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  public getId(): ClockId {
    return this.clockId;
  }
}
