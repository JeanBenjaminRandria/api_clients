export interface Client {
  id: number;
  name: string;
  rif: string;
  referrer?: Client;
  referrerId?: number;
  createdAt: Date;
  updatedAt: Date;
}
