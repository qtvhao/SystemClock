import { EmitFiveMinuteTickCommand } from "../../Application/Commands/EmitFiveMinuteTickCommand";

export interface SchedulerPort {
  scheduleFiveMinuteJob(command: EmitFiveMinuteTickCommand): void;
}
