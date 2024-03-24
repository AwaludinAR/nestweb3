import { Module } from '@nestjs/common';
import { Web3Module } from '../../../lib';
import { WsService } from './ws.service';
import { WsController } from './ws.controller';

@Module({
  imports: [
    Web3Module.forRoot('wss://bsc-rpc.publicnode.com', {
      connectionName: 'Websocket1',
      provider: {
        name: 'WS',
      },
    }),
  ],
  controllers: [WsController],
  providers: [WsService],
  exports: [],
})
export class WsModule {}
