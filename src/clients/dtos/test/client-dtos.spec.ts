import { plainToClass } from 'class-transformer';
import { Client } from 'src/clients/client.interface';
import { ClientMicroDto } from '..';
import { ClientMinDto } from '../client-min.dto';
import { ClientReadDto } from '../client-read.dto';
import { ClientUpdateDto } from '../client-update.dto';
import { ClientDto } from '../client.dtos';

describe('Test client dots', () => {
  const referrer: Client = {
    id: 1,
    name: 'Client 1',
    rif: 'J-30997933-0',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const client: Client = {
    id: 2,
    name: 'Client 2',
    rif: 'J-30997933-7',
    referrerId: referrer.id,
    referrer: referrer,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('Client Micro Dto', () => {
    const expectDto: ClientMicroDto = {
      name: referrer.name,
      rif: referrer.rif,
    };
    const microDto = plainToClass(ClientMicroDto, referrer);
    expect(microDto).toEqual(expectDto);
  });

  it('Client Min Dto', () => {
    const expectDto: ClientMinDto = {
      id: referrer.id,
      name: referrer.name,
      rif: referrer.rif,
    };
    const microDto = plainToClass(ClientMinDto, referrer);
    expect(microDto).toEqual(expectDto);
  });

  it('Client Read Dto', () => {
    const expectDto: ClientReadDto = {
      id: client.id,
      name: client.name,
      rif: client.rif,
      referrer: {
        id: referrer.id,
        name: referrer.name,
        rif: referrer.rif,
      },
    };
    const microDto = plainToClass(ClientReadDto, client);
    expect(microDto).toEqual(expectDto);
  });

  it('Client Dto', () => {
    const expectDto: ClientDto = {
      name: client.name,
      rif: client.rif,
      referrerId: referrer.id,
    };
    const clientDto = plainToClass(ClientDto, client);
    expect(clientDto).toEqual(expectDto);
  });

  it('Client Update Dto', () => {
    const expectDto: ClientDto = {
      name: client.name,
      rif: client.rif,
      referrerId: referrer.id,
    };
    const clientUpdate = plainToClass(ClientUpdateDto, client);
    expect(clientUpdate).toEqual(expectDto);
  });
});
