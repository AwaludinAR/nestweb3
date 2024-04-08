import { Injectable } from '@nestjs/common';
import { InjectWeb3 } from '../../../lib';
import Web3 from 'web3';

@Injectable()
export class WsService {
  constructor(@InjectWeb3('WS_ASYNC') private web3: Web3) {}

  getBlockNumber() {
    return this.web3.eth.getBlockNumber();
  }
}
