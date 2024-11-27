import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface StoreState {
  currentFloor: number;
  targetFloor: number;
  isTransitioning: boolean;
  direction: 'up' | 'down' | null;
  reservedFloors: Set<number>;
  isLoginModalOpen: boolean;
  isAuthenticated: boolean;
  setCurrentFloor: (floor: number) => void;
  setTargetFloor: (floor: number) => void;
  setTransitioning: (transitioning: boolean) => void;
  isFloorAvailable: (floor: number) => boolean;
  reserveFloor: (floor: number) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  subscribeWithSelector((set, get) => ({
    currentFloor: 100,
    targetFloor: 100,
    isTransitioning: false,
    direction: null,
    reservedFloors: new Set([100, 99, 98, 90, 85, 80, 75, 70, 65, 60, 50, 45, 40, 30, 20, 10]),
    isLoginModalOpen: false,
    isAuthenticated: false,
    setCurrentFloor: (floor) => set({ currentFloor: floor }),
    setTargetFloor: (floor) => {
      const currentFloor = get().currentFloor;
      set({ 
        targetFloor: floor,
        direction: floor > currentFloor ? 'up' : 'down'
      });
    },
    setTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
    isFloorAvailable: (floor) => !get().reservedFloors.has(floor),
    reserveFloor: (floor) => set((state) => ({
      reservedFloors: new Set([...state.reservedFloors, floor])
    })),
    openLoginModal: () => set({ isLoginModalOpen: true }),
    closeLoginModal: () => set({ isLoginModalOpen: false }),
    login: async (email: string, password: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (email && password) {
        set({ isAuthenticated: true, isLoginModalOpen: false });
        return true;
      }
      return false;
    },
    logout: () => set({ isAuthenticated: false }),
  }))
);