import { v4 as uuidv4 } from 'uuid';

export class ClockId {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ?? uuidv4();
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: ClockId): boolean {
    return this.value === other.toString();
  }
}
