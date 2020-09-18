import { plainToClass } from 'class-transformer';
import { Client } from '../../model/client.interface';
import { Status } from '../../status.enum';
import { ClientMicroDto } from '..';
import { ClientMinDto } from '../clients/client-min.dto';
import { ClientReadExDto } from '../clients/client-read-ex.dto';
import { ClientReadDto } from '../clients/client-read.dto';
import { ClientUpdateDto } from '../clients/client-update.dto';
import { ClientDto } from '../clients/client.dtos';
import { ClientReadReferrersDto } from '../clients/client-referrers.dto';
import { PaginationClientsDto } from '../paginations/pagination-clients.dto';

describe('Test client dots', () => {
  const referrer: Client = {
    id: 1,
    name: 'Client 1',
    rif: 'J-30997933-0',
    status: Status.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const client: Client = {
    id: 2,
    name: 'Client 2',
    rif: 'J-30997933-0',
    referrerId: referrer.id,
    referrer: referrer,
    status: Status.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  referrer.referrers = [client];

  const pagination = {
    count: 1,
    clients: [client],
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

  it('Client Read Extends Dto', () => {
    const expectDto: ClientReadExDto = {
      id: client.id,
      name: client.name,
      rif: client.rif,
      status: client.status,
      referrer: {
        id: referrer.id,
        name: referrer.name,
        rif: referrer.rif,
      },
    };
    const microDto = plainToClass(ClientReadExDto, client);
    expect(microDto).toEqual(expectDto);
  });

  it('Client referrers Dto', () => {
    const expectDto: ClientReadReferrersDto = {
      id: referrer.id,
      name: referrer.name,
      rif: referrer.rif,
      referrers: [
        {
          id: client.id,
          name: client.name,
          rif: client.rif,
        },
      ],
    };
    const microDto = plainToClass(ClientReadReferrersDto, referrer);
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

  it('Pagination Dto', () => {
    const paginationDto = plainToClass(PaginationClientsDto, pagination);
    expect(paginationDto.clients[0]).toEqual(client);
    expect(pagination.count).toEqual(paginationDto.count);
  });
});
