export const STORAGE_KEYS = {
  moneyBoard: 'planora_money_board',
  weeklyWeek: 'planora_weekly_week',
  studyWeek: 'planora_study_week',
  settings: 'planora_settings',
} as const;

export function loadFromLocalStorage<T>(key: string, fallback: T): T {
  try {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return fallback;
    }

    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.error(`Failed to load localStorage key "${key}"`, error);
    return fallback;
  }
}

export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save localStorage key "${key}"`, error);
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}"`, error);
  }
}