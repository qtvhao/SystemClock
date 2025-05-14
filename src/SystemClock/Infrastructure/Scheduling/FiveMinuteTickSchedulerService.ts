// src/SharedKernel/Application/CommandBus.ts

export interface CommandBus {
  dispatch<TCommand>(command: TCommand): Promise<void>;
}
