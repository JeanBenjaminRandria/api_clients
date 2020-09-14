import { TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Client } from "../src/clients/client.interface";
import { Repository } from "typeorm";
import { ClientEntity } from "../src/clients/client.entity";
import { ClientDto } from "../src/clients/dtos";


export class LoadDataTest {

    private readonly clientRepository: Repository<ClientEntity>

    private client: Client;
    private clientOfClient: Client;

    constructor(
        private readonly module: TestingModule
    ) {
        this.clientRepository = module.get(getRepositoryToken(ClientEntity))
    }

    private async createClient(): Promise<Client> {
        const prospect: ClientDto = {
            name: 'Client 1',
            rif: 'J-040518160-5'
        }
        return this.saveClient(prospect);
    }

    private async createClientOfClient(): Promise<Client> {
        const prospect: ClientDto = {
            name: 'Client 2',
            rif: 'J-040518160-5',
            referrerId: this.client.id
        }
        return this.saveClient(prospect);
    }

    private async saveClient(prospect: ClientDto) {
        const client = this.clientRepository.create(prospect);
        return await this.clientRepository.save(client);
    }

    async loadClients() {
        if (!this.client || !this.clientOfClient) {
            this.client = await this.createClient();
            this.clientOfClient = await this.createClientOfClient();
        }
    }

    async getClient() {
        if (!this.client) {
            this.client = await this.createClient();
        }
        return this.client
    }

    async getClientToClient() {
        if (!this.clientOfClient) {
            this.clientOfClient = await this.createClientOfClient();
        }
        return this.clientOfClient
    }

    async deleteAll(): Promise<void> {
        await this.clientRepository.query(
            'TRUNCATE TABLE clients RESTART IDENTITY CASCADE',
        );
        this.client = undefined;
        this.clientOfClient = undefined;

        return
    }

    async closeAll(): Promise<void> {
        await this.clientRepository.manager.connection.close();
        return;
    }

}