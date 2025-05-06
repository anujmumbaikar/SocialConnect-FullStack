import { create } from 'zustand';

const useUserStore = create((set) => ({
  profileData: null,
  shouldRefetchProfile: false,
  setShouldRefetchProfile: (value:any) => set({ shouldRefetchProfile: value }),
}));
export default useUserStore;