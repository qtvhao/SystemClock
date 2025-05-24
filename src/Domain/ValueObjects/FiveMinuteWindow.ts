export class FiveMinuteWindow {
  private readonly start: Date;
  private readonly end: Date;

  constructor(referenceTime: Date = new Date()) {
    const minutes = referenceTime.getMinutes();
    const flooredMinutes = minutes - (minutes % 5);
    this.start = new Date(referenceTime);
    this.start.setMinutes(flooredMinutes, 0, 0);

    this.end = new Date(this.start);
    this.end.setMinutes(this.start.getMinutes() + 5);
  }

  public getStart(): Date {
    return new Date(this.start);
  }

  public getEnd(): Date {
    return new Date(this.end);
  }

  public toString(): string {
    return `${this.start.toISOString()} - ${this.end.toISOString()}`;
  }

  public equals(other: FiveMinuteWindow): boolean {
    return this.start.getTime() === other.getStart().getTime() &&
           this.end.getTime() === other.getEnd().getTime();
  }
}
