import {
    EventConstructor,
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
import { ClockScheduler } from "./ClockScheduler";
import { ClockId } from "../../Domain/ValueObjects/ClockId";
import { EmitFiveMinuteTickHandler } from "../../Application/Handlers/EmitFiveMinuteTickHandler";
import { ServiceProvider } from "support.ts";
import { FiveMinuteTickOccurredEvent } from "../../Domain/Events/FiveMinuteTickOccurredEvent";
import { ClockDomainEventMapper } from "../../Application/Handlers/Events/ClockDomainEventMapper";

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
        const clockId = new ClockId();
        const handler = new EmitFiveMinuteTickHandler(
            this.app.get<IEventBus>(TYPES.EventBus),
        );
        const scheduler = new ClockScheduler(handler, clockId);
        //
        const handlerResolver = this.app.get<IEventHandlerResolver>(
          TYPES.EventHandlerResolver,
        );
        handlerResolver.register(FiveMinuteTickOccurredEvent, new ClockEventHandler());
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
            mapper.register("clock.fiveMinuteTick", FiveMinuteTickOccurredEvent);

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
