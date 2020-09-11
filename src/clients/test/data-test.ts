import { ClientDto } from "../dtos";
import { Client } from "../client.interface";

export const clientDto: ClientDto = {
    name: 'client test',
    rif: 'J-3041933-7'
}

export const clientDtoSaved: Client = {
    id: 123,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...clientDto
}

export const idNoExist: number = 1000

export const updateRes = {
  "generatedMaps": [],
  "raw": [],
  "affected": 1
}

export const deleteRes = {
  "raw": [],
  "affected": 1
}