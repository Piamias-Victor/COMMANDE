import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lab } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface LabState {
  labs: Lab[];
  selectedLabId: string | null;
  isLoading: boolean;
  
  // Actions
  addLab: (name: string, logoUrl?: string) => void;
  selectLab: (id: string | null) => void;
  removeLab: (id: string) => void;
  updateLab: (id: string, updates: Partial<Omit<Lab, 'id' | 'createdAt'>>) => void;
}

export const useLabStore = create<LabState>()(
  persist(
    (set, get) => ({
      labs: [],
      selectedLabId: null,
      isLoading: false,

      addLab: (name, logoUrl) => {
        const newLab: Lab = {
          id: uuidv4(),
          name,
          logoUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          labs: [...state.labs, newLab],
          selectedLabId: state.selectedLabId || newLab.id,
        }));
        
        return newLab.id;
      },

      selectLab: (id) => {
        set({ selectedLabId: id });
      },

      removeLab: (id) => {
        set((state) => ({
          labs: state.labs.filter((lab) => lab.id !== id),
          selectedLabId: state.selectedLabId === id ? null : state.selectedLabId,
        }));
      },

      updateLab: (id, updates) => {
        set((state) => ({
          labs: state.labs.map((lab) => 
            lab.id === id 
              ? { ...lab, ...updates, updatedAt: new Date() } 
              : lab
          ),
        }));
      },
    }),
    {
      name: 'pharm-labs-storage',
    }
  )
);