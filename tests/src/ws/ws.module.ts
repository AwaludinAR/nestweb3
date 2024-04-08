import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Web3Module } from '../../../lib';
import { WsService } from './ws.service';
import { WsController } from './ws.controller';

@Module({
  imports: [
    Web3Module.forRoot('wss://bsc-rpc.publicnode.com', {
      connectionName: 'WS',
      provider: {
        name: 'WS',
      },
    }),
    Web3Module.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'WS_ASYNC',
      useFactory: async (config: ConfigService) => ({
        clientUrl: config.get('CLIENT_WS_URL'),
        provider: { name: 'WS' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [WsController],
  providers: [WsService],
  exports: [],
})
export class WsModule {}
