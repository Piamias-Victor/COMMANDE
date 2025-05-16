import { create } from 'zustand';
import { UIState } from '@/types';

interface UIStoreState extends UIState {
  // Actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  isLoading: false,
  error: null,
  notification: {
    type: null,
    message: null,
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  showNotification: (type, message) => {
    set({ 
      notification: {
        type,
        message,
      }
    });
    
    // Effacer la notification après 5 secondes
    setTimeout(() => {
      set((state) => {
        // Ne pas effacer si une nouvelle notification est apparue entre-temps
        if (state.notification.message === message) {
          return { 
            notification: {
              type: null,
              message: null,
            }
          };
        }
        return state;
      });
    }, 5000);
  },

  clearNotification: () => {
    set({ 
      notification: {
        type: null,
        message: null,
      }
    });
  },
}));