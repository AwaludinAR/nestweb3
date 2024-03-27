import { Controller, Get } from '@nestjs/common';
import { WsService } from './ws.service';

@Controller('ws')
export class WsController {
  constructor(private wsService: WsService) {}

  @Get('block_number:current')
  getCurrentBlockNumber() {
    return this.wsService.getBlockNumber();
  }
}
