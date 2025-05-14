// src/SystemClock/Application/Commands/EmitFiveMinuteTickCommand.ts

import { FiveMinuteWindow } from '../../Domain/ValueObjects/FiveMinuteWindow';

/**
 * Command to trigger the emission of a five-minute tick.
 * This command is intended to be handled by the system clock application service.
 */
export class EmitFiveMinuteTickCommand {
  public readonly window: FiveMinuteWindow;

  constructor(window: FiveMinuteWindow) {
    this.window = window;
  }
}
