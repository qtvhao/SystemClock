import {
    EventConstructor,
    ICommandBus,
    ICommandHandlerResolver,
    IDomainEvent,
    IDomainEventMapperRegistry,
    IEventBus,
    IEventHandler,
    IEventHandlerResolver,
    IEventTopicMapper,
    IServiceProvider,
    Message,
    TYPES,
} from "contracts.ts";
import { TYPES as SYSTEM_CLOCK_TYPES } from "./types.0";
import { ClockScheduler } from "./ClockScheduler";
import { ClockId } from "../../Domain/ValueObjects/ClockId";
import { EmitFiveMinuteTickHandler } from "../../Application/Handlers/EmitFiveMinuteTickHandler";
import { ServiceProvider } from "support.ts";
import { FiveMinuteTickOccurredEvent } from "../../Domain/Events/FiveMinuteTickOccurredEvent";
import { ClockDomainEventMapper } from "../../Application/Handlers/Events/ClockDomainEventMapper";
import { FiveMinuteTickPublisherContract } from "../../Domain/Contracts/FiveMinuteTickPublisherContract";
import { EmitFiveMinuteTickCommand } from "../../Application/Commands/EmitFiveMinuteTickCommand";

class ClockEventHandler implements IEventHandler<FiveMinuteTickOccurredEvent> {
    async handle(event: FiveMinuteTickOccurredEvent): Promise<void> {
        console.log(`Handled ClockEvent for aggregateId: ${event.aggregateId}`);
    }

    supports() {
        return [FiveMinuteTickOccurredEvent];
    }
}

export class SystemClockServiceProvider extends ServiceProvider
    implements IServiceProvider {
    public register(): void {
        const defaultClockId = new ClockId("SYSTEM");
        this.app.bind<FiveMinuteTickPublisherContract>(
            SYSTEM_CLOCK_TYPES.ClockScheduler,
        )
            .toDynamicValue(() => {
                const commandBus = this.app.get<ICommandBus>(TYPES.CommandBus);
                return new ClockScheduler(commandBus, defaultClockId);
            }).inSingletonScope();
        //
        this.app.bind(EmitFiveMinuteTickHandler).toSelf();
        this.app.get<ICommandHandlerResolver>(TYPES.CommandHandlerResolver)
            .register(
                EmitFiveMinuteTickCommand,
                this.app.get(EmitFiveMinuteTickHandler),
            );
        const scheduler = this.app.get<FiveMinuteTickPublisherContract>(
            SYSTEM_CLOCK_TYPES.ClockScheduler,
        );
        //
        const eventHandlerResolver = this.app.get<IEventHandlerResolver>(
            TYPES.EventHandlerResolver,
        );
        eventHandlerResolver.register(
            FiveMinuteTickOccurredEvent,
            new ClockEventHandler(),
        );
        //

        this.booted(async () => {
            await this.app.get<IEventBus>(TYPES.EventBus)?.subscribe<
                FiveMinuteTickOccurredEvent
            >(
                FiveMinuteTickOccurredEvent,
                new ClockEventHandler(),
            );
            await scheduler.start();
        });

        this.booting(() => {
            const mapper = this.app.get<IEventTopicMapper>(
                TYPES.EventTopicMapper,
            );
            mapper.register(
                "clock.fiveMinuteTick",
                FiveMinuteTickOccurredEvent,
            );

            const domainEventMapperRegistry = this.app.get<
                IDomainEventMapperRegistry<IDomainEvent, Message>
            >(
                TYPES.DomainEventMapperRegistry,
            );
            domainEventMapperRegistry.set(
                new FiveMinuteTickOccurredEvent("aggr-id", new ClockId())
                    .eventName(),
                new ClockDomainEventMapper(),
            );
        });
    }
}
