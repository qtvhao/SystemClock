// src/SystemClock/Application/Handlers/EmitFiveMinuteTickHandler.ts

import { EmitFiveMinuteTickCommand } from '../Commands/EmitFiveMinuteTickCommand';
import { FiveMinuteTickPublisherContract } from '../../Domain/Contracts/FiveMinuteTickPublisherContract';
import { FiveMinuteTickOccurredEvent } from '../../Domain/Events/FiveMinuteTickOccurredEvent';

/**
 * Handles the EmitFiveMinuteTickCommand by publishing a FiveMinuteTickOccurredEvent.
 */
export class EmitFiveMinuteTickHandler {
  private readonly publisher: FiveMinuteTickPublisherContract;

  constructor(publisher: FiveMinuteTickPublisherContract) {
    this.publisher = publisher;
  }

  public async handle(command: EmitFiveMinuteTickCommand): Promise<void> {
    const event = new FiveMinuteTickOccurredEvent(command.window);
    await this.publisher.publish(event);
  }
}
