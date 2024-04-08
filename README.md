# @awaludinar/nestweb3

## Description

[Web3.js](https://web3js.org) module for [Nest](https://github.com/nestjs/nest).

## Installation

Install module

```bash
npm i --save @awaludinar/nestweb3 web3
```

## Usage/Examples

### Simple usage

Import module in any module

```typescript
import { Module } from '@nestjs/common';
import { Web3Module } from '@awaludinar/nestweb3';

@Module({
  import: [Web3Module.forRoot('http://client-rpc-url.tld')],
})
export class AppModule {}
```

Use in service

```typescript
import { Injectable } from '@nestjs/common';
import { InjectWeb3 } from '@awaludinar/nestweb3';
import Web3 from 'web3';

@Injectable()
export class WsService {
  constructor(@InjectWeb3() private web3: Web3) {}

  getBlockNumber() {
    return this.web3.eth.getBlockNumber();
  }
}
```

### Multiple RPC

Import module in any module

```typescript
import { Module } from '@nestjs/common';
import { Web3Module } from '@awaludinar/nestweb3';

@Module({
  import: [
    Web3Module.forRoot('http://client-rpc-url.tld', {
      connectionName: 'RPC1',
      provider: { name: 'HTTP' /* or WS */ },
    }),
    Web3Module.forRoot('wss://client-rpc-url.tld', {
      connectionName: 'RPC2',
      provider: { name: 'WS' /* or WS */ },
    }),
  ],
})
export class AppModule {}
```

Use in service

```typescript
import { Injectable } from '@nestjs/common';
import { InjectWeb3 } from '@awaludinar/nestweb3';
import Web3 from 'web3';

@Injectable()
export class WsService {
  constructor(@InjectWeb3('RPC1') private web3: Web3) {}

  getBlockNumber() {
    return this.web3.eth.getBlockNumber();
  }
}
```

### Async Configuration

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Web3Module } from '@awaludinar/nestweb3';

@Module({
  import: [
    Web3Module.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'RPC_ASYNC',
      useFactory: async (config: ConfigService) => ({
        clientUrl: config.get('CLIENT_WS_URL'),
        provider: { name: 'HTTP' /* or WS */ },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AnyModule {}
```
