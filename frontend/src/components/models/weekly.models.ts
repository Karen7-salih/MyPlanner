export type WeeklyTaskCategory =
  | 'study'
  | 'cleaning'
  | 'going_out'
  | 'gym'
  | 'doctor'
  | 'beauty'
  | 'other';

export interface WeeklyChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface WeeklyTask {
  id: string;
  title?: string;
  category: WeeklyTaskCategory;
  notes?: string;
  checklist: WeeklyChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyDay {
  date: string;
  dayName: string;
  tasks: WeeklyTask[];
}

export interface WeeklyPlannerWeek {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  days: WeeklyDay[];
}