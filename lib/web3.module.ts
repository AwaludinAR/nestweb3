import { DynamicModule, Module } from '@nestjs/common';
import { IWeb3ModuleOptions } from './web3.interface';
import { Web3CoreModule } from './web3-core.module';

@Module({})
export class Web3Module {
  static forRoot(
    clientUrl: string,
    options: IWeb3ModuleOptions = {},
  ): DynamicModule {
    return {
      module: Web3Module,
      imports: [Web3CoreModule.forRoot(clientUrl, options)],
    };
  }
}
