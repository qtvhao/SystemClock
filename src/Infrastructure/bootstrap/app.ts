import { AppBootstrapper, Application } from "kernel.ts";
import path from "path";
import { ServiceProvider } from "support.ts";
import { EventBusServiceProvider, InMemoryMessageBroker } from "messaging.ts";
import {
    EachMessagePayload,
    EventConstructor,
    IDomainEvent,
    IDomainEventMapper,
    IDomainEventMapperRegistry,
    IEventBus,
    IEventHandler,
    IEventHandlerResolver,
    IEventTopicMapper,
    IMessageBroker,
    IMessageBrokerFactoryMap,
    Message,
    MessageHandler,
    TYPES,
} from "contracts.ts";

//
class ClockEvent implements IDomainEvent {
    __brand: "DomainEvent" = "DomainEvent";
    public readonly occurredOn: Date;
    public readonly aggregateId: string;

    version() {
        return 1;
    }
    eventName() {
        return "ClockEvent";
    }
    constructor(aggregateId: string) {
        this.occurredOn = new Date();
        this.aggregateId = aggregateId;
    }
}
class ClockEventHandler implements IEventHandler<ClockEvent> {
    async handle(event: ClockEvent): Promise<void> {
        console.log(`Handled ClockEvent for aggregateId: ${event.aggregateId}`);
    }

    supports() {
        return [ClockEvent];
    }
}

export const app = new Application(
    {
        base: path.resolve(__dirname, "../"), // Project root
        config: path.resolve(__dirname, "../Config"), // Configuration files
        database: path.resolve(__dirname, "../Database"), // Database files or migrations
        resources: path.resolve(__dirname, "../Resources"), // Views, translations, etc.
        storage: path.resolve(__dirname, "../Storage"), // Logs, cache, etc.
        lang: path.resolve(__dirname, "../Resources/lang"), // Language files
        public: path.resolve(__dirname, "../../public"), // Publicly served assets
    },
    "production",
    true,
    "vi-VN",
);

class X implements IMessageBroker {
    async subscribe<T>(topic: string, handler: MessageHandler): Promise<void> {
        console.log({ topic });
        setTimeout(() => {
            handler({
                topic,
                message: {
                    key: Buffer.from(""),
                    value: Buffer.from(JSON.stringify({
                        s: 1,
                    })),
                },
            } as EachMessagePayload);
        }, 10);
    }
    unsubscribe(topic: string): Promise<void> {
        return new Promise((r) => {});
    }
    async produce(topic: string, message: Buffer): Promise<void> {
        console.log({ topic, message });
    }
    setup(): Promise<void> {
        return new Promise((r) => {});
    }
    start(): Promise<void> {
        return new Promise((r) => {});
    }
}

class EventHandlerResolver implements IEventHandlerResolver {
    register<T extends IDomainEvent>(
        event: EventConstructor<T>,
        handler: IEventHandler<T>,
    ): void {
    }
    resolve<T extends IDomainEvent>(
        event: EventConstructor<T>,
    ): IEventHandler<T> {
        return new ClockEventHandler() as IEventHandler<T>;
    }
}
interface ClockEventDTO {
    x: string;
}
class ClockDomainEventMapper
    implements IDomainEventMapper<Message, ClockEvent> {
    toDTO(event: ClockEvent): Message {
        return {
            key: "x",
            value: JSON.stringify({
                x: event.aggregateId,
            }),
            headers: {},
        };
    }
    toDomain(dto: object): ClockEvent {
        const data = dto as ClockEventDTO;
        return new ClockEvent(data.x);
    }
    isDomainEvent(event: IDomainEvent): event is ClockEvent {
        return true;
    }
}
class AppServiceProvider extends ServiceProvider {
    register(): void {
        const creators: IMessageBrokerFactoryMap = new Map();
        creators.set("inmemory", () => {
            const broker = new InMemoryMessageBroker();
            broker.setup();
            broker.start();

            return broker;
        });
        this.app.bind<IMessageBrokerFactoryMap>(TYPES.MessageBrokerFactoryMap)
            .toConstantValue(creators);
        this.app.bind<IEventHandlerResolver>(TYPES.EventHandlerResolver)
            .toConstantValue(new EventHandlerResolver());
        this.booting(() => {
            const mapper = this.app.get<IEventTopicMapper>(
                TYPES.EventTopicMapper,
            );
            mapper.register("topic1", ClockEvent);

            const domainEventMapperRegistry = this.app.get<
                IDomainEventMapperRegistry<IDomainEvent, Message>
            >(
                TYPES.DomainEventMapperRegistry,
            );
            domainEventMapperRegistry.set(
                new ClockEvent("").eventName(),
                new ClockDomainEventMapper(),
            );
        });
        this.booted(() => {
            this.app.get<IEventBus>(TYPES.EventBus)?.subscribe<ClockEvent>(
                ClockEvent,
                new ClockEventHandler(),
            );
            this.app.get<IEventBus>(TYPES.EventBus).publish([
                new ClockEvent("aggr-idx"),
            ]);
        });
    }
}

const bootstrapper = new AppBootstrapper(app, [
    new AppServiceProvider(app),
    new EventBusServiceProvider(app),
]);
bootstrapper.bootstrap();
