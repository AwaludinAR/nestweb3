import { DEFAULT_WEB3_CONNECTION } from '../web3.constants';

export function getConnectionToken(name?: string) {
  return name && name !== DEFAULT_WEB3_CONNECTION
    ? `${name}Connection`
    : DEFAULT_WEB3_CONNECTION;
}
