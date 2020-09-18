export interface Client {
  id: number;
  name: string;
  rif: string;
  status: string;
  referrer?: Client;
  referrers?: Client[];
  referrerId?: number;
  createdAt: Date;
  updatedAt: Date;
}
