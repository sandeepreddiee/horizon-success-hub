// Shared intervention store for syncing between pages
export interface InterventionRecord {
  id: string;
  studentId: number;
  studentName: string;
  major: string;
  riskTier: "High" | "Medium" | "Low";
  content: string;
  date: Date;
  type: "meeting" | "referral" | "check-in" | "tutoring" | "note";
}

// In-memory store for interventions
let interventionsStore: InterventionRecord[] = [];
let listeners: Array<() => void> = [];

export const interventionStore = {
  getAll: (): InterventionRecord[] => {
    return [...interventionsStore].sort((a, b) => b.date.getTime() - a.date.getTime());
  },
  
  add: (intervention: Omit<InterventionRecord, 'id'>) => {
    const newIntervention: InterventionRecord = {
      ...intervention,
      id: `intervention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    interventionsStore.unshift(newIntervention);
    listeners.forEach(listener => listener());
    return newIntervention;
  },
  
  initialize: (interventions: InterventionRecord[]) => {
    // Only initialize if empty (to avoid overwriting user-added interventions)
    if (interventionsStore.length === 0) {
      interventionsStore = interventions;
      listeners.forEach(listener => listener());
    }
  },
  
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  
  getForStudent: (studentId: number): InterventionRecord[] => {
    return interventionsStore
      .filter(i => i.studentId === studentId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  },
  
  getTodaysCount: (): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return interventionsStore.filter(i => {
      const interventionDate = new Date(i.date);
      interventionDate.setHours(0, 0, 0, 0);
      return interventionDate.getTime() === today.getTime();
    }).length;
  }
};
