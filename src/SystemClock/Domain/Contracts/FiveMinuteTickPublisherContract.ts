// src/SystemClock/Domain/Contracts/FiveMinuteTickPublisherContract.ts

import { FiveMinuteTickOccurredEvent } from '../Events/FiveMinuteTickOccurredEvent';

export interface FiveMinuteTickPublisherContract {
  publish(event: FiveMinuteTickOccurredEvent): Promise<void>;
}
