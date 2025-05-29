import {
    ICommandBus,
    ICommandHandlerResolver,
    IDomainEvent,
    IDomainEventMapperRegistry,
    IEventBus,
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
import { ClockEventHandler } from "../../Application/Handlers/Events/ClockEventHandler";

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
        this.app.bind(ClockEventHandler).toSelf();
        this.app.get<ICommandHandlerResolver>(TYPES.CommandHandlerResolver)
            .register(
                EmitFiveMinuteTickCommand,
                this.app.get(EmitFiveMinuteTickHandler),
            );
        //
        this.app.get<IEventHandlerResolver>(
            TYPES.EventHandlerResolver,
        ).register(
            FiveMinuteTickOccurredEvent,
            this.app.get(ClockEventHandler),
        );
        //
        this.booting(async () => {
            await this.mapEventTopics();
            await this.registerEventMappers();
            await this.subscribeEventHandlers();
        });

        this.booted(async () => {
            const scheduler = this.app.get<FiveMinuteTickPublisherContract>(
                SYSTEM_CLOCK_TYPES.ClockScheduler,
            );
            await scheduler.start();
        });
    }

    async mapEventTopics(): Promise<void> {
        const mapper = this.app.get<IEventTopicMapper>(TYPES.EventTopicMapper);
        mapper.register(
            "clock.fiveMinuteTick",
            FiveMinuteTickOccurredEvent,
        );
    }

    async registerEventMappers(): Promise<void> {
        this.app.get<IDomainEventMapperRegistry<IDomainEvent, Message>>(
            TYPES.DomainEventMapperRegistry,
        ).set(
            FiveMinuteTickOccurredEvent,
            new ClockDomainEventMapper(),
        );
    }

    async subscribeEventHandlers(): Promise<void> {
        await this.app.get<IEventBus>(TYPES.EventBus).subscribe<
            FiveMinuteTickOccurredEvent
        >(
            FiveMinuteTickOccurredEvent,
            this.app.get(ClockEventHandler),
        );
    }
}
