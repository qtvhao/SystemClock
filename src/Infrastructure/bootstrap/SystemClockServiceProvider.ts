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

class EventHandlerResolver implements IEventHandlerResolver {
    private handlers = new Map<string, IEventHandler<any>>();

    register<T extends IDomainEvent>(
        event: EventConstructor<T>,
        handler: IEventHandler<T>,
    ): void {
        this.handlers.set(event.name, handler);
    }

    resolve<T extends IDomainEvent>(
        event: EventConstructor<T>,
    ): IEventHandler<T> {
        const handler = this.handlers.get(event.name);
        if (!handler) {
            throw new Error(`No handler registered for event: ${event.name}`);
        }

        return handler as IEventHandler<T>;
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
        scheduler.start();
        //
        const resolver = new EventHandlerResolver();

        resolver.register(FiveMinuteTickOccurredEvent, new ClockEventHandler());

        this.app.bind<IEventHandlerResolver>(TYPES.EventHandlerResolver)
            .toConstantValue(resolver);

        //

        this.booted(() => {
            this.app.get<IEventBus>(TYPES.EventBus)?.subscribe<
                FiveMinuteTickOccurredEvent
            >(
                FiveMinuteTickOccurredEvent,
                new ClockEventHandler(),
            );
        });

        this.booting(() => {
            const mapper = this.app.get<IEventTopicMapper>(
                TYPES.EventTopicMapper,
            );
            mapper.register("topic1", FiveMinuteTickOccurredEvent);

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
