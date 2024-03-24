import { Inject } from '@nestjs/common';
import { getConnectionToken } from './web3.utils';

export function InjectWeb3(connectionName?: string) {
  return Inject(getConnectionToken(connectionName));
}
