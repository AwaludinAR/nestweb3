import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { WEB3_CONNECTION_NAME } from './web3.constants';
import {
  HttpProvider,
  SupportedProviders,
  Web3,
  WebSocketProvider,
} from 'web3';
import { IWeb3ModuleOptions } from './web3.interface';
import { getConnectionToken } from './common';
import { defer, lastValueFrom } from 'rxjs';

@Global()
@Module({})
export class Web3CoreModule {
  public static readonly logger = new Logger(Web3CoreModule.name);
  constructor() {}

  static forRoot(
    clientUrl: string,
    opts: IWeb3ModuleOptions = {},
  ): DynamicModule {
    const { connectionName, connectionFactory, provider } = opts;

    const web3ConnectionFactory =
      connectionFactory || ((connection) => connection);
    const web3Provider = provider || { name: 'HTTP', providerOptions: {} };

    const web3ConnectionName = getConnectionToken(connectionName);

    const web3ConnectionNameProvider = {
      provide: WEB3_CONNECTION_NAME,
      useValue: web3ConnectionName,
    };

    const connectionProvider = {
      provide: web3ConnectionName,
      useFactory: async () =>
        await lastValueFrom(
          defer(async () =>
            web3ConnectionFactory(
              await Web3CoreModule.createWeb3Connection(
                clientUrl,
                web3Provider,
              ),
              web3ConnectionName,
            ),
          ),
        ),
    };

    return {
      module: Web3CoreModule,
      providers: [connectionProvider, web3ConnectionNameProvider],
      exports: [connectionProvider],
    };
  }

  private static async createWeb3Connection(
    clientUrl: string,
    provider: IWeb3ModuleOptions['provider'],
  ) {
    if (!provider?.name) {
      provider = { name: 'HTTP', providerOptions: {} };
    }

    let web3Provider: SupportedProviders;
    switch (provider.name) {
      case 'HTTP':
        web3Provider = new HttpProvider(clientUrl, provider);
        break;
      case 'WS':
        web3Provider = new WebSocketProvider(
          clientUrl,
          provider,
          provider.reconnectOptions,
        );
        break;
      default:
        throw new Error('Invalid provider name');
    }
    console.log('WEB3 Created:', provider.name);
    return new Web3(web3Provider);
  }
}
