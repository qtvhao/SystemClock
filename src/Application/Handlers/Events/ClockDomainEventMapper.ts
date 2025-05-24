import { IDomainEvent, IDomainEventMapper, Message } from "contracts.ts";
import { FiveMinuteTickOccurredEvent } from "../../../Domain/Events/FiveMinuteTickOccurredEvent";
import { ClockTickedDTO } from "../../DTOs/ClockTickedDTO";
import { ClockId } from "../../../Domain/ValueObjects/ClockId";

export class ClockDomainEventMapper
    implements IDomainEventMapper<Message, FiveMinuteTickOccurredEvent> {
    toDTO(event: FiveMinuteTickOccurredEvent): Message {
        return {
            value: JSON.stringify({
                aggregateId: event.aggregateId,
            }),
            headers: {},
        };
    }
    toDomain(dto: object): FiveMinuteTickOccurredEvent {
        const data = dto as ClockTickedDTO;
        return new FiveMinuteTickOccurredEvent(data.aggregateId, new ClockId());
    }
    isDomainEvent(event: IDomainEvent): event is FiveMinuteTickOccurredEvent {
        return true;
    }
}
