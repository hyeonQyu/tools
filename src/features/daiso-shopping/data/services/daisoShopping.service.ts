import { DaisoSavedStore, DaisoShoppingSettingsPayload } from '@/features/daiso-shopping/types';
import { getServiceCreator } from '@/firebase';
import { DaisoShoppingService, DaisoShoppingServiceDeps } from './daisoShopping.service.types';

const DEFAULT_SETTINGS: DaisoShoppingSettingsPayload = { stores: [], selectedStoreCode: null };

const toSavedStore = (store: DaisoSavedStore | { storeCode: string; storeName: string; address: string }): DaisoSavedStore => ({
  storeCode: store.storeCode,
  storeName: store.storeName,
  address: store.address,
  lat: 'lat' in store ? store.lat : undefined,
  lng: 'lng' in store ? store.lng : undefined,
  phone: 'phone' in store ? store.phone : undefined,
  openTime: 'openTime' in store ? store.openTime : undefined,
  closeTime: 'closeTime' in store ? store.closeTime : undefined,
});

export const createDaisoShoppingService = getServiceCreator<DaisoShoppingService, DaisoShoppingServiceDeps>(
  ({ daisoShoppingItemsRepository, daisoShoppingSettingsRepository }) => {
    const getSettings = async () => (await daisoShoppingSettingsRepository.get()) ?? DEFAULT_SETTINGS;

    return {
      findAll: () => daisoShoppingItemsRepository.findAll(),

      addProduct: async (product) => {
        const items = await daisoShoppingItemsRepository.findAll();
        const existing = items.find((item) => item.productId === product.id);
        if (existing) return existing;

        const maxOrder = items.reduce((max, item) => Math.max(max, item.order), 0);

        return daisoShoppingItemsRepository.create({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          brand: product.brand,
          memo: '',
          done: false,
          order: maxOrder + 1,
        });
      },

      update: (id, payload) => daisoShoppingItemsRepository.update(id, payload),

      delete: (id) => daisoShoppingItemsRepository.delete(id),

      clearDone: async () => {
        const items = await daisoShoppingItemsRepository.findAll();
        await Promise.all(items.filter((item) => item.done).map((item) => daisoShoppingItemsRepository.delete(item.id)));
      },

      getSettings,

      saveStore: async (store) => {
        const settings = await getSettings();
        const savedStore = toSavedStore(store);
        const others = settings.stores.filter((item) => item.storeCode !== savedStore.storeCode);

        await daisoShoppingSettingsRepository.saveStores([...others, savedStore]);
        await daisoShoppingSettingsRepository.selectStore(savedStore.storeCode);
      },

      removeStore: async (storeCode) => {
        const settings = await getSettings();
        const remaining = settings.stores.filter((item) => item.storeCode !== storeCode);

        await daisoShoppingSettingsRepository.saveStores(remaining);

        if (settings.selectedStoreCode === storeCode) {
          await daisoShoppingSettingsRepository.selectStore(remaining[0]?.storeCode ?? null);
        }
      },

      selectStore: (storeCode) => daisoShoppingSettingsRepository.selectStore(storeCode),
    };
  },
);
