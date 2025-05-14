// src/SystemClock/Domain/ValueObjects/FiveMinuteWindow.ts

export class FiveMinuteWindow {
  private readonly start: Date;
  private readonly end: Date;

  private constructor(start: Date, end: Date) {
    if (end.getTime() - start.getTime() !== 5 * 60 * 1000) {
      throw new Error('FiveMinuteWindow must be exactly five minutes long.');
    }

    this.start = new Date(start);
    this.end = new Date(end);
  }

  public static fromStartTime(start: Date): FiveMinuteWindow {
    const alignedStart = new Date(start);
    alignedStart.setSeconds(0, 0); // align to minute boundary
    alignedStart.setMinutes(Math.floor(alignedStart.getMinutes() / 5) * 5);

    const end = new Date(alignedStart);
    end.setMinutes(end.getMinutes() + 5);

    return new FiveMinuteWindow(alignedStart, end);
  }

  public equals(other: FiveMinuteWindow): boolean {
    return this.start.getTime() === other.start.getTime() &&
           this.end.getTime() === other.end.getTime();
  }

  public getStart(): Date {
    return new Date(this.start);
  }

  public getEnd(): Date {
    return new Date(this.end);
  }

  public toString(): string {
    return `[${this.start.toISOString()} - ${this.end.toISOString()}]`;
  }
}
