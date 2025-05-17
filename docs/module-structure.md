src/
└── SystemClock/
    ├── Domain/
    │   ├── Events/
    │   │   └── FiveMinuteTickOccurredEvent.ts
    │   └── Contracts/
    │       └── ClockPublisher.ts
    ├── Application/
    │   ├── Commands/
    │   │   └── EmitFiveMinuteTickCommand.ts
    │   ├── Handlers/
    │   │   └── EmitFiveMinuteTickHandler.ts
    │   └── DTOs/
    ├── Infrastructure/
    │   ├── Messaging/
    │   │   └── Kafka/
    │   │       └── Producers/
    │   │           └── ClockEventKafkaProducer.ts
    │   └── Scheduling/
    │       └── CronScheduler.ts
    └── Presentation/
        └── Routes/
            └── ScheduleRoutes.ts
