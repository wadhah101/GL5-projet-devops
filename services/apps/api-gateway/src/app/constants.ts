import { Inject } from '@nestjs/common';

export const MESSAGING_SERVICE_TOKEN = Symbol(
  '@my-workspace/messaging:service'
);

export const InjectClientProxy = (
  token: string | symbol
): ReturnType<typeof Inject> => Inject(token);
