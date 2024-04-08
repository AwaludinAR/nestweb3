import { ModuleMetadata, Type } from '@nestjs/common';
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
  clientUrl?: string;
  connectionName?: string;
  connectionFactory?: (connection: Web3, name: string) => Web3;
  provider?: IHttpProviderOptions | TWebSocketProviderOptions;
}

export type TWeb3ModuleFactoryOptions = Omit<
  IWeb3ModuleOptions,
  'connectionName'
>;

export interface IWeb3OptionsFactory {
  createWeb3Options(): Promise<IWeb3ModuleOptions> | IWeb3ModuleOptions;
}

export interface IWeb3ModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  connectionName?: string;
  useExisting?: Type<IWeb3OptionsFactory>;
  useClass?: Type<IWeb3OptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<TWeb3ModuleFactoryOptions> | TWeb3ModuleFactoryOptions;
  inject?: any[];
}
