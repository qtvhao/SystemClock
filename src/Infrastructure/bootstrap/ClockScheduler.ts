import { EmitFiveMinuteTickCommand } from "../../Application/Commands/EmitFiveMinuteTickCommand";
import { EmitFiveMinuteTickHandler } from "../../Application/Handlers/EmitFiveMinuteTickHandler";
import { FiveMinuteTickPublisherContract } from "../../Domain/Contracts/FiveMinuteTickPublisherContract";
import { ClockId } from "../../Domain/ValueObjects/ClockId";

export class ClockScheduler implements FiveMinuteTickPublisherContract {
  private readonly intervalMillis = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly handler: EmitFiveMinuteTickHandler,
    private readonly clockId: ClockId
  ) {}

  public start(): void {
    // Immediate tick
    this.handler.execute(new EmitFiveMinuteTickCommand(this.clockId.toString()));

    // Recurring tick
    setInterval(() => {
      this.handler.execute(new EmitFiveMinuteTickCommand(this.clockId.toString()));
    }, this.intervalMillis);
  }
}
