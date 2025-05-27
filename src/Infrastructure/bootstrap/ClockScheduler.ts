import { inject } from "inversify";
import { EmitFiveMinuteTickCommand } from "../../Application/Commands/EmitFiveMinuteTickCommand";
import { FiveMinuteTickPublisherContract } from "../../Domain/Contracts/FiveMinuteTickPublisherContract";
import { ICommandBus, TYPES } from "contracts.ts";
import { ClockId } from "../../Domain/ValueObjects/ClockId";

export class ClockScheduler implements FiveMinuteTickPublisherContract {
  private readonly intervalMillis = 5 * 60 * 1000; // 5 minutes

  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: ICommandBus,
    private readonly clockId: ClockId
  ) {}

  public async start(): Promise<void> {
    await this.commandBus.dispatch(new EmitFiveMinuteTickCommand(this.clockId));

    setInterval(async () => {
      await this.commandBus.dispatch(new EmitFiveMinuteTickCommand(this.clockId));
    }, this.intervalMillis);
  }
}
