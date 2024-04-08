import {
  DynamicModule,
  Global,
  Logger,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { WEB3_CONNECTION_NAME, WEB3_MODULE_OPTIONS } from './web3.constants';
import {
  HttpProvider,
  SupportedProviders,
  Web3,
  WebSocketProvider,
} from 'web3';
import {
  IWeb3ModuleAsyncOptions,
  IWeb3ModuleOptions,
  IWeb3OptionsFactory,
  TWeb3ModuleFactoryOptions,
} from './web3.interface';
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

  static forRootAsync(opts: IWeb3ModuleAsyncOptions): DynamicModule {
    const web3ConnectionName = getConnectionToken(opts.connectionName);
    const web3ConnectionProvider = {
      provide: WEB3_CONNECTION_NAME,
      useValue: web3ConnectionName,
    };

    const connectionProvider = {
      provide: web3ConnectionName,
      useFactory: async (web3ModuleOptions: TWeb3ModuleFactoryOptions) => {
        const { clientUrl, connectionFactory, provider } = web3ModuleOptions;
        const web3ConnectionFactory =
          connectionFactory || ((connection) => connection);

        return lastValueFrom(
          defer(async () =>
            web3ConnectionFactory(
              await Web3CoreModule.createWeb3Connection(
                clientUrl as string,
                provider,
              ),
              web3ConnectionName,
            ),
          ),
        );
      },
      inject: [WEB3_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(opts);
    return {
      module: Web3CoreModule,
      imports: opts.imports,
      providers: [
        ...asyncProviders,
        connectionProvider,
        web3ConnectionProvider,
        this.createAsyncOptionsProvider(opts),
      ],
      exports: [connectionProvider],
    };
  }

  private static createAsyncProviders(
    options: IWeb3ModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<IWeb3OptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: IWeb3ModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: WEB3_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<IWeb3OptionsFactory>,
    ];

    return {
      provide: WEB3_MODULE_OPTIONS,
      useFactory: async (optionsFactory: IWeb3OptionsFactory) =>
        await optionsFactory.createWeb3Options(),
      inject,
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
