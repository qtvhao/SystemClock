import { ICommandHandler, IDomainEvent, IEventBus } from "contracts.ts";
import { EmitFiveMinuteTickCommand } from "../Commands/EmitFiveMinuteTickCommand";
import { Clock } from "../../Domain/Entities/Clock";

export class EmitFiveMinuteTickHandler implements ICommandHandler<EmitFiveMinuteTickCommand> {
    constructor(private readonly eventBus: IEventBus) {}

    public async handle(command: EmitFiveMinuteTickCommand): Promise<void> {
        const clockId = command.clockId;
        const clock = new Clock(clockId);

        clock.tick();

        const domainEvents = clock.pullDomainEvents();
        await this.eventBus.publish(domainEvents);
    }
    getPublishedEvents(): ReadonlyArray<IDomainEvent> {
        return [];
    }
}
