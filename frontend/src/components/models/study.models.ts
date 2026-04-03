export type StudySubject =
  | 'math'
  | 'english'
  | 'arabic'
  | 'programming'
  | 'online_course'
  | 'other';

export interface StudyChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface StudyTask {
  id: string;
  title?: string;
  subject: StudySubject | string;
  notes?: string;
  checklist: StudyChecklistItem[];
  createdAt: string;
  updatedAt: string;
}
export interface StudyDay {
  date: string;
  dayName: string;
  tasks: StudyTask[];
}

export interface StudyPlannerWeek {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  days: StudyDay[];
}