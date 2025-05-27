import { ICommand } from "contracts.ts";
import { v4 as uuidv4 } from "uuid";
import { ClockId } from "../../Domain/ValueObjects/ClockId";

export class EmitFiveMinuteTickCommand implements ICommand {
  public readonly commandId: string;
  public readonly commandType = "EMIT_FIVE_MINUTE_TICK";
  public readonly aggregateId: string;
  public readonly occurredOn: Date;

  constructor(public readonly clockId: ClockId) {
    this.commandId = uuidv4();
    this.aggregateId = clockId.toString();
    this.occurredOn = new Date();
  }
}
