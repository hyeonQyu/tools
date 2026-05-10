export type FuelPaymentUserPayload = {
  groupId: string;
  color: string;
};

export type FuelPaymentUserEntity = {
  id: string;
} & FuelPaymentUserPayload;

export interface FuelPaymentUsersRepository {
  upsert: (id: string, payload: FuelPaymentUserPayload) => Promise<void>;
  findByGroupId: (groupId: string) => Promise<FuelPaymentUserEntity[]>;
  delete: (id: string) => Promise<void>;
}
