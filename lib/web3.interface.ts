import { ClientRequestArgs } from 'http';
import { ClientOptions, CloseEvent } from 'isomorphic-ws';
import Web3 from 'web3';
import { ReconnectOptions } from 'web3-utils';

export interface IHttpProviderOptions {
  name: 'HTTP';
  providerOptions: RequestInit;
}

export type TWebSocketProviderOptions =
  | (ClientOptions | ClientRequestArgs) & {
      name: 'WS';
      reconnectOptions?: Partial<ReconnectOptions>;
    };

export interface IWeb3ModuleOptions {
  connectionName?: string;
  connectionFactory?: (connection: Web3, name: string) => Web3;
  provider?: IHttpProviderOptions | TWebSocketProviderOptions;
}
