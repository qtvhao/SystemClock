import { AppBootstrapper } from "kernel.ts";
import { EventBusServiceProvider } from "messaging.ts";
import { SystemClockServiceProvider } from "./SystemClockServiceProvider";
import { CqrsServiceProvider } from "cqrs.ts";
import { app } from "kernel.ts/dist/bootstrap/app"

const bootstrapper = new AppBootstrapper(app, [
    new EventBusServiceProvider(app),
    new CqrsServiceProvider(app),
    new SystemClockServiceProvider(app),
]);
bootstrapper.bootstrap();

const gracefulShutdown = async () => {
  console.debug("[App] Terminating application...");
  await app.terminate();
  console.debug("[App] Application terminated.");
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
