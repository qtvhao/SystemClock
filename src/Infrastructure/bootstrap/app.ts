import { AppBootstrapper, Application } from "kernel.ts";
import path from "path";
import { ServiceProvider } from "support.ts";
import { EventBusServiceProvider } from "messaging.ts";
import {
    EventConstructor,
    IDomainEvent,
    IEventBus,
    IEventHandler,
    IEventHandlerResolver,
    IEventTopicMapper,
    IMessageBroker,
    IMessageBrokerFactoryMap,
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
// class ClockEventHandler implements IEventHandler<ClockEvent> {
//     async handle(event: ClockEvent): Promise<void> {
//         console.log(`Handled ClockEvent for aggregateId: ${event.aggregateId}`);
//     }

//     supports() {
//         return [ClockEvent];
//     }
// }

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
    subscribe<T>(topic: string, handler: MessageHandler): Promise<void> {
        return new Promise((r) => {});
    }
    unsubscribe(topic: string): Promise<void> {
        return new Promise((r) => {});
    }
    produce(topic: string, message: Buffer): Promise<void> {
        return new Promise((r) => {});
    }
    setup(): Promise<void> {
        return new Promise((r) => {});
    }
    start(): Promise<void> {
        return new Promise((r) => {});
    }
}
class XEventHandler implements IEventHandler {
    async handle(event: IDomainEvent): Promise<void> {
    }
    supports(): EventConstructor<IDomainEvent>[] {
        return [ClockEvent];
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
        return new XEventHandler() as IEventHandler<T>;
    }
}
class AppServiceProvider extends ServiceProvider {
    register(): void {
        const creators: IMessageBrokerFactoryMap = new Map();
        creators.set("inmemory", () => {
            return new X();
        });
        this.app.bind<IMessageBrokerFactoryMap>(TYPES.MessageBrokerFactoryMap)
            .toConstantValue(creators);
        this.app.bind<IEventHandlerResolver>(TYPES.EventHandlerResolver)
            .toConstantValue(new EventHandlerResolver());
        const eventBusServiceProvider = new EventBusServiceProvider(this.app);
        this.app.register(eventBusServiceProvider);
        // // this.app.get<IEventTopicMapper>(TYPES.EventTopicMapper).register('my-memory-topic', ClockEvent);
        // this.booting(() => {
        //     eventBusServiceProvider.callBootingCallbacks();
        //     // this.app.get<IEventMapperRegistry>(TYPES.EventMapperRegistry).set('my-memory-topic', )
        // });
        // this.booted(() => {
        //     console.log(".");
        //     eventBusServiceProvider.callBootedCallbacks();
        //     // this.app.get<IEventBus>(TYPES.EventBus)?.subscribe<ClockEvent>(
        //     //     ClockEvent,
        //     //     new ClockEventHandler(),
        //     // );
        //     this.app.get<IEventBus>(TYPES.EventBus).publish([
        //         // new ClockEvent("aggr-id"),
        //     ]);
        // });
    }
}

class Bootstrapper extends AppBootstrapper {}

const bootstrapper = new Bootstrapper(app, [new AppServiceProvider(app)]);
bootstrapper.bootstrap();
