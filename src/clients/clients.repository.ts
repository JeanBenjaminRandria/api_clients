import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './client.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { Observable, from, of, throwError, merge } from 'rxjs';
import { map, mergeMap, filter, isEmpty } from 'rxjs/operators';
import { Client } from './client.interface';
import { ClientDto, ClientUpdateDto } from './dtos';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly _repository: Repository<ClientEntity>,
  ) {}

  getAll(): Observable<Client[]> {
    return from(this._repository.find({ relations: ['referrer'] }));
  }

  get(id: number): Observable<Client> {
    const find = from(
      this._repository.findOne({ where: { id }, relations: ['referrer'] }),
    );
    return merge(
      find
        .pipe(filter(cli => cli === undefined))
        .pipe(
          mergeMap(() =>
            throwError(new NotFoundException(`Client has not been found`)),
          ),
        ),
      find.pipe(filter(cli => cli !== undefined)),
    );
  }

  ValidateReferrerId(client: ClientDto): Observable<ClientEntity> {
    return of(client)
      .pipe(map(cli => cli.referrerId))
      .pipe(filter(id => id !== undefined))
      .pipe(mergeMap(id => this.validateDontExistIdDb(id)))
      .pipe(filter(isEmpty => isEmpty === false))
      .pipe(
        mergeMap(() =>
          throwError(new BadRequestException('Referrer does not exist')),
        ),
      );
  }

  validateDontExistIdDb(id: number): Observable<boolean> {
    return of(id)
      .pipe(mergeMap(id => this._repository.findOne(id)))
      .pipe(filter(cli => cli === undefined))
      .pipe(isEmpty());
  }

  validateDontExistRifDb(rif: string): Observable<boolean> {
    return of(rif)
      .pipe(mergeMap(rif => this._repository.findOne({ rif })))
      .pipe(filter(cli => cli !== undefined))
      .pipe(isEmpty());
  }

  validateRif(client: ClientDto): Observable<any> {
    return of(client.rif)
      .pipe(mergeMap(rif => this.validateDontExistRifDb(rif)))
      .pipe(filter(isEmpty => isEmpty === false))
      .pipe(
        mergeMap(() =>
          throwError(new BadRequestException('Client already exist')),
        ),
      );
  }

  create(clientProspect: ClientDto): Observable<any> {
    return merge(
      this.ValidateReferrerId(clientProspect),
      this.validateRif(clientProspect),
    )
      .pipe(isEmpty())
      .pipe(filter(val => val === true))
      .pipe(mergeMap(() => this.saveClient(clientProspect)));
  }

  private saveClient(clientProspect: ClientDto): Observable<Client> {
    const client = this._repository.create(clientProspect);
    return from(this._repository.save(client)).pipe(
      mergeMap(cli => this.get(cli.id)),
    );
  }

  update(id: number, clientProspect: ClientUpdateDto): Observable<Client> {
    return this.get(id)
      .pipe(mergeMap(() => this._repository.update(id, clientProspect)))
      .pipe(mergeMap(() => this.get(id)));
  }

  delete(id: number): Observable<DeleteResult> {
    return from(this._repository.delete(id));
  }
}
