import { FuelPaymentService, FuelPaymentServiceDependencies } from '@/features/fuel-payment/data/services/fuelPayment.service.types';
import { firebase, getServiceCreator } from '@/firebase';

const DEFAULT_MEMBER_COLOR = '#ef5350';

export const createFuelPaymentService = getServiceCreator<FuelPaymentService, FuelPaymentServiceDependencies>(
  ({ fuelPaymentGroupsRepository, fuelPaymentUsersRepository }) => {
    return {
      createGroup: async () => {
        const group = await fuelPaymentGroupsRepository.create();
        const userId = firebase.auth.currentUser!.uid;
        await fuelPaymentUsersRepository.upsert(userId, { groupId: group.id, color: DEFAULT_MEMBER_COLOR });
        return group;
      },

      getMyGroup: async () => {
        return fuelPaymentGroupsRepository.findMyGroup();
      },

      addMember: async (groupId: string, userId: string, color: string) => {
        await fuelPaymentGroupsRepository.addMember(groupId, userId);
        await fuelPaymentUsersRepository.upsert(userId, { groupId, color });
      },

      removeMember: async (groupId: string, userId: string) => {
        await fuelPaymentGroupsRepository.removeMember(groupId, userId);
        await fuelPaymentUsersRepository.delete(userId);
      },

      deleteGroup: async (groupId: string) => {
        await fuelPaymentGroupsRepository.delete(groupId);
      },

      getGroupUsers: async (groupId: string) => {
        return fuelPaymentUsersRepository.findByGroupId(groupId);
      },

      addRecord: async (groupId, record) => {
        await fuelPaymentGroupsRepository.addRecord(groupId, record);
      },

      updateRecord: async (groupId, originalDate, record) => {
        await fuelPaymentGroupsRepository.updateRecord(groupId, originalDate, record);
      },

      removeRecord: async (groupId, date) => {
        await fuelPaymentGroupsRepository.removeRecord(groupId, date);
      },
    };
  },
);
