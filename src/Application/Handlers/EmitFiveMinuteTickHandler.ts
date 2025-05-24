import { IEventBus } from "contracts.ts";
import { EmitFiveMinuteTickCommand } from "../Commands/EmitFiveMinuteTickCommand";
import { ClockId } from "../../Domain/ValueObjects/ClockId";
import { Clock } from "../../Domain/Entities/Clock";

export class EmitFiveMinuteTickHandler {
    constructor(private readonly eventBus: IEventBus) {}

    public async execute(command: EmitFiveMinuteTickCommand): Promise<void> {
        const clockId = new ClockId(command.clockId);
        const clock = new Clock(clockId);

        clock.tick();

        const domainEvents = clock.pullDomainEvents();
        await this.eventBus.publish(domainEvents);
    }
}
