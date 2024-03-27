import { Controller, Get } from '@nestjs/common';
import { WsService } from './ws.service';

@Controller('ws')
export class WsController {
  constructor(private wsService: WsService) {}

  @Get('current-block-number')
  getCurrentBlockNumber() {
    return this.wsService.getBlockNumber();
  }
}
