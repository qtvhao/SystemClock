export interface ClockTickedDTO {
  aggregateId: string;
  clockId: string;
  occurredOn: string; // ISO 8601 format
}
