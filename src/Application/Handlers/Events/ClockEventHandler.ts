import { IEventHandler } from "contracts.ts";
import { FiveMinuteTickOccurredEvent } from "../../../Domain/Events/FiveMinuteTickOccurredEvent";

export class ClockEventHandler implements IEventHandler<FiveMinuteTickOccurredEvent> {
    async handle(event: FiveMinuteTickOccurredEvent): Promise<void> {
        console.log(`Handled ClockEvent for aggregateId: ${event.aggregateId}`);
    }

    supports() {
        return [FiveMinuteTickOccurredEvent];
    }
}
