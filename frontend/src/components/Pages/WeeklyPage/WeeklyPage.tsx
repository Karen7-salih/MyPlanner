import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type {
  WeeklyChecklistItem,
  WeeklyDay,
  WeeklyPlannerWeek,
  WeeklyTask,
  WeeklyTaskCategory,
} from '../../models/weekly.models';
import { STORAGE_KEYS, loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

function getInitialWeeklyWeek() {
  return loadFromLocalStorage<WeeklyPlannerWeek>(
    STORAGE_KEYS.weeklyWeek,
    initialWeeklyWeek
  );
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const categoryOptions: {
  value: WeeklyTaskCategory;
  label: string;
  color: string;
  badge: string;
  dot: string;
}[] = [
    {
      value: 'study',
      label: 'Study',
      color: 'border-[#cda996] bg-[#f7ece6]',
      badge: 'bg-[#ead7cd] text-[#7b5f55]',
      dot: 'bg-[#b785d6]',
    },
    {
      value: 'cleaning',
      label: 'Cleaning',
      color: 'border-[#cdbb86] bg-[#f6f3e8]',
      badge: 'bg-[#e7e0c8] text-[#6f6652]',
      dot: 'bg-[#e39ab3]',
    },
    {
      value: 'going_out',
      label: 'Going Out',
      color: 'border-[#cfa0b0] bg-[#f8edf2]',
      badge: 'bg-[#ead5de] text-[#7a5f69]',
      dot: 'bg-[#d58aaa]',
    },
    {
      value: 'gym',
      label: 'Gym',
      color: 'border-[#b7add6] bg-[#f1eef8]',
      badge: 'bg-[#ddd6ee] text-[#665d7c]',
      dot: 'bg-[#8b7bd6]',
    },
    {
      value: 'doctor',
      label: 'Doctor',
      color: 'border-[#94c1bc] bg-[#edf7f6]',
      badge: 'bg-[#d4ebe8] text-[#52726f]',
      dot: 'bg-[#5fa8a0]',
    },
    {
      value: 'beauty',
      label: 'Beauty',
      color: 'border-[#d7a9bc] bg-[#fbf0f5]',
      badge: 'bg-[#f1dce6] text-[#815f70]',
      dot: 'bg-[#d784a9]',
    },
    {
      value: 'other',
      label: 'Other',
      color: 'border-[#bfaea3] bg-[#f8f5f2]',
      badge: 'bg-[#ebe4de] text-[#6f625b]',
      dot: 'bg-[#a99084]',
    },
  ];

function formatDateLabel(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

function getStartOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function createEmptyWeek(): WeeklyPlannerWeek {
  const start = getStartOfWeek(new Date());
  const days: WeeklyDay[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      date: date.toISOString(),
      dayName: dayNames[date.getDay()],
      tasks: [],
    };
  });

  return {
    id: 'weekly-current',
    weekStartDate: days[0].date,
    weekEndDate: days[6].date,
    days,
  };
}

const initialWeeklyWeek: WeeklyPlannerWeek = {
  ...createEmptyWeek(),
  days: createEmptyWeek().days.map((day, index) => {
    if (index === 0) {
      return {
        ...day,
        tasks: [
          {
            id: 'w1',
            title: 'Plan study blocks',
            category: 'study',
            notes: 'Decide what to revise this week',
            checklist: [
              { id: 'wc1', text: 'Math chapter review', completed: false },
              { id: 'wc2', text: 'English vocab revision', completed: true },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };
    }

    if (index === 2) {
      return {
        ...day,
        tasks: [
          {
            id: 'w2',
            title: 'Gym + self care',
            category: 'beauty',
            notes: 'Workout then beauty appointment prep',
            checklist: [
              { id: 'wc3', text: 'Gym bag ready', completed: false },
              { id: 'wc4', text: 'Book appointment', completed: false },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };
    }

    return day;
  }),
};

function createChecklistItem(text: string): WeeklyChecklistItem {
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
  };
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WeeklyPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const savedWeeklyWeek = loadFromLocalStorage<WeeklyPlannerWeek>(
    STORAGE_KEYS.weeklyWeek,
    initialWeeklyWeek
  );

  const [weeklyWeek, setWeeklyWeek] = useState<WeeklyPlannerWeek>(getInitialWeeklyWeek);
  const [selectedDate, setSelectedDate] = useState<string>(() => getInitialWeeklyWeek().days[0].date);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WeeklyTaskCategory>('study');
  const [notes, setNotes] = useState('');
  const [checklistInput, setChecklistInput] = useState('');
  const [draftChecklist, setDraftChecklist] = useState<WeeklyChecklistItem[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.weeklyWeek, weeklyWeek);
  }, [weeklyWeek]);
  const dayDropdownRef = useRef<HTMLDivElement | null>(null);

  const totalTasks = useMemo(
    () => weeklyWeek.days.reduce((sum, day) => sum + day.tasks.length, 0),
    [weeklyWeek]
  );

  const completedChecklistCount = useMemo(
    () =>
      weeklyWeek.days.reduce(
        (sum, day) =>
          sum +
          day.tasks.reduce(
            (taskSum, task) => taskSum + task.checklist.filter((item) => item.completed).length,
            0
          ),
        0
      ),
    [weeklyWeek]
  );

  const resetForm = () => {
    setTitle('');
    setCategory('study');
    setNotes('');
    setChecklistInput('');
    setDraftChecklist([]);
    setEditingTaskId(null);
    setIsCategoryDropdownOpen(false);
    setIsDayDropdownOpen(false);
  };

  const handleAddChecklistItem = () => {
    const trimmed = checklistInput.trim();

    if (!trimmed) {
      return;
    }

    setDraftChecklist((prev) => [...prev, createChecklistItem(trimmed)]);
    setChecklistInput('');
  };

  const handleRemoveDraftChecklistItem = (itemId: string) => {
    setDraftChecklist((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleDraftChecklistKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddChecklistItem();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const now = new Date().toISOString();
    const trimmedTitle = title.trim();
    const trimmedNotes = notes.trim();

    if (!trimmedTitle && !trimmedNotes && draftChecklist.length === 0) {
      return;
    }

    setWeeklyWeek((prev) => ({
      ...prev,
      days: prev.days.map((day) => {
        if (day.date !== selectedDate) {
          return day;
        }

        if (editingTaskId) {
          return {
            ...day,
            tasks: day.tasks.map((task) =>
              task.id === editingTaskId
                ? {
                  ...task,
                  title: trimmedTitle || undefined,
                  category,
                  notes: trimmedNotes || undefined,
                  checklist: draftChecklist,
                  updatedAt: now,
                }
                : task
            ),
          };
        }

        const newTask: WeeklyTask = {
          id: crypto.randomUUID(),
          title: trimmedTitle || undefined,
          category,
          notes: trimmedNotes || undefined,
          checklist: draftChecklist,
          createdAt: now,
          updatedAt: now,
        };

        return {
          ...day,
          tasks: [newTask, ...day.tasks],
        };
      }),
    }));

    resetForm();
  };

  const handleDeleteTask = (taskId: string, dayDate: string) => {
    setWeeklyWeek((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.date === dayDate
          ? { ...day, tasks: day.tasks.filter((task) => task.id !== taskId) }
          : day
      ),
    }));

    if (editingTaskId === taskId) {
      resetForm();
    }
  };

  const handleEditTask = (task: WeeklyTask, dayDate: string) => {
    setSelectedDate(dayDate);
    setEditingTaskId(task.id);
    setTitle(task.title ?? '');
    setCategory(task.category);
    setNotes(task.notes ?? '');
    setChecklistInput('');
    setDraftChecklist(task.checklist);
    setIsCategoryDropdownOpen(false);
    setIsDayDropdownOpen(false);
  };

  const handleToggleChecklist = (dayDate: string, taskId: string, checklistId: string) => {
    setWeeklyWeek((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.date === dayDate
          ? {
            ...day,
            tasks: day.tasks.map((task) =>
              task.id === taskId
                ? {
                  ...task,
                  checklist: task.checklist.map((item) =>
                    item.id === checklistId ? { ...item, completed: !item.completed } : item
                  ),
                  updatedAt: new Date().toISOString(),
                }
                : task
            ),
          }
          : day
      ),
    }));
  };

  const activeDayLabel =
    weeklyWeek.days.find((day) => day.date === selectedDate)?.dayName ?? 'Selected day';

  const selectedDay =
    weeklyWeek.days.find((day) => day.date === selectedDate) ?? weeklyWeek.days[0];

  const selectedCategoryMeta =
    categoryOptions.find((option) => option.value === category) ?? categoryOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }

      if (
        dayDropdownRef.current &&
        !dayDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDayDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.24em] text-[#b08f82]">
            Weekly planner
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-[#3c312c]">
            Plan your week with clarity
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-[#eadfd7] bg-white px-4 py-3 shadow-sm">
          <span className="rounded-full bg-[#f7ece6] px-3 py-1 text-sm font-medium text-[#7b5f55]">
            {totalTasks} tasks
          </span>
          <span className="rounded-full bg-[#f8f5f2] px-3 py-1 text-sm font-medium text-[#6f625b]">
            {completedChecklistCount} completed checklist items
          </span>

          <div className="h-5 w-px bg-[#eadfd7]" />

          <div className="flex flex-wrap items-center gap-3">
            {categoryOptions.map((option) => (
              <div key={option.value} className="inline-flex items-center gap-2 text-sm text-[#6f625b]">
                <span className={`h-2.5 w-2.5 rounded-full ${option.dot}`} />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="rounded-[28px] border border-[#eadfd7] bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#3c312c]">
            {editingTaskId ? `Edit task for ${activeDayLabel}` : `Add task for ${activeDayLabel}`}
          </h3>
          <p className="mt-1 text-sm text-[#8d7b73]">
            Add a category, optional notes, and a clean checklist.
          </p>
        </div>

        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>

          <div className="relative" ref={dayDropdownRef}>
            <button
              type="button"
              onClick={() => setIsDayDropdownOpen((prev) => !prev)}
              className={`flex w-full items-center justify-between rounded-2xl border bg-[#fffaf7] px-4 py-3 text-left text-[#3c312c] outline-none transition ${isDayDropdownOpen
                ? 'border-[#c9aea1] shadow-[0_0_0_3px_rgba(201,174,161,0.12)]'
                : 'border-[#eadfd7] hover:border-[#d8c7bd]'
                }`}
              aria-haspopup="listbox"
              aria-expanded={isDayDropdownOpen}
            >
              <span className="text-sm font-medium">
                {selectedDay.dayName} - {formatDateLabel(new Date(selectedDay.date))}
              </span>

              <span className="text-[#8d7b73]">
                <ChevronDownIcon open={isDayDropdownOpen} />
              </span>
            </button>

            {isDayDropdownOpen ? (
              <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-[22px] border border-[#e2d4cc] bg-white shadow-[0_16px_40px_rgba(60,49,44,0.12)]">
                <div className="p-2"> {/* 👈 NO SCROLL */}
                  {weeklyWeek.days.map((day) => {
                    const isSelected = day.date === selectedDate;

                    return (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => {
                          setSelectedDate(day.date);
                          setIsDayDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm transition ${isSelected
                          ? 'bg-[#f7ece6] text-[#3c312c]'
                          : 'text-[#5f544d] hover:bg-[#fcf7f4]'
                          }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span>
                          {day.dayName} - {formatDateLabel(new Date(day.date))}
                        </span>

                        {isSelected ? (
                          <span className="text-xs font-medium text-[#9b7d72]">
                            Selected
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={categoryDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
              className={`flex w-full items-center justify-between rounded-2xl border bg-[#fffaf7] px-4 py-3 text-left text-[#3c312c] outline-none transition ${isCategoryDropdownOpen
                ? 'border-[#c9aea1] shadow-[0_0_0_3px_rgba(201,174,161,0.12)]'
                : 'border-[#eadfd7] hover:border-[#d8c7bd]'
                }`}
              aria-haspopup="listbox"
              aria-expanded={isCategoryDropdownOpen}
            >
              <span className="inline-flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${selectedCategoryMeta.dot}`} />
                <span className="text-sm font-medium">{selectedCategoryMeta.label}</span>
              </span>

              <span className="text-[#8d7b73]">
                <ChevronDownIcon open={isCategoryDropdownOpen} />
              </span>
            </button>

            {isCategoryDropdownOpen ? (
              <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-[22px] border border-[#e2d4cc] bg-white shadow-[0_16px_40px_rgba(60,49,44,0.12)]">
                <div className="p-2">
                  {categoryOptions.map((option) => {
                    const isSelected = option.value === category;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setCategory(option.value);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${isSelected
                          ? 'bg-[#f7ece6] text-[#3c312c]'
                          : 'text-[#5f544d] hover:bg-[#fcf7f4]'
                          }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full ${option.dot}`} />
                        <span className="flex-1">{option.label}</span>
                        {isSelected ? (
                          <span className="text-xs font-medium text-[#9b7d72]">Selected</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-[100px] w-full rounded-2xl border border-[#eadfd7] bg-[#fffaf7] px-4 py-3 text-[#3c312c] outline-none placeholder:text-[#a6948c] focus:border-[#c9aea1]"
            />
          </div>

          <div className="space-y-3 md:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Add checklist item"
                value={checklistInput}
                onChange={(event) => setChecklistInput(event.target.value)}
                onKeyDown={handleDraftChecklistKeyDown}
                className="flex-1 rounded-2xl border border-[#eadfd7] bg-[#fffaf7] px-4 py-3 text-[#3c312c] outline-none placeholder:text-[#a6948c] focus:border-[#c9aea1]"
              />

              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="rounded-2xl border border-[#eadfd7] bg-white px-4 py-3 font-medium text-[#6f625b] transition hover:bg-[#f7ece6]"
              >
                Add item
              </button>
            </div>

            {draftChecklist.length > 0 ? (
              <div className="space-y-2 rounded-[22px] border border-[#eadfd7] bg-[#fcfaf8] p-3">
                {draftChecklist.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2"
                  >
                    <div className="flex items-center gap-3 text-sm text-[#4f433d]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#e6d7ce] text-[11px] text-[#9b7d72]">
                        {index + 1}
                      </span>
                      <span>{item.text}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveDraftChecklistItem(item.id)}
                      className="rounded-full px-2 py-1 text-xs font-medium text-[#9b7d72] transition hover:bg-[#f7ece6]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#dfd0c7] bg-[#fcfaf8] px-4 py-3 text-sm text-[#9b8a82]">
                No checklist items yet
              </div>
            )}
          </div>

          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              className="rounded-2xl bg-[#3c312c] px-4 py-3 font-medium text-white transition hover:opacity-90"
            >
              {editingTaskId ? 'Save changes' : 'Add task'}
            </button>

            {editingTaskId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-[#eadfd7] bg-[#fffaf7] px-4 py-3 font-medium text-[#6f625b] transition hover:bg-[#f7ece6]"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {weeklyWeek.days.map((day) => (
          <div
            key={day.date}
            className="rounded-[28px] border border-[#eadfd7] bg-white p-4 shadow-sm"
          >
            <div className="mb-4">
              <p className="text-sm uppercase tracking-[0.2em] text-[#b08f82]">{day.dayName}</p>
              <h3 className="mt-1 text-lg font-semibold text-[#3c312c]">
                {formatDateLabel(new Date(day.date))}
              </h3>
            </div>

            <div className="space-y-3">
              {day.tasks.length > 0 ? (
                day.tasks.map((task) => {
                  const categoryMeta =
                    categoryOptions.find((option) => option.value === task.category) ?? categoryOptions[6];

                  return (
                    <div
                      key={task.id}
                      className={`rounded-[24px] border-[1.5px] p-4 shadow-[0_1px_2px_rgba(60,49,44,0.04)] ${categoryMeta.color}`}
                    >
                      <div className="mb-3">
                        <div className="-ml-2 flex items-center justify-between gap-3">
                          <div className="-mr-1 flex items-center gap-1.5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${categoryMeta.badge}`}
                            >
                              {categoryMeta.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleEditTask(task, day.date)}
                              className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-medium text-[#7b5f55] transition hover:bg-white"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task.id, day.date)}
                              className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-medium text-[#9b7d72] transition hover:bg-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {task.title ? (
                          <h4 className="mt-2 break-words text-base font-semibold text-[#3c312c]">
                            {task.title}
                          </h4>
                        ) : null}

                        {task.notes ? (
                          <p className="mt-2 break-words text-sm leading-6 text-[#6f625b]">
                            {task.notes}
                          </p>
                        ) : null}
                      </div>

                      {task.checklist.length > 0 ? (
                        <div className="space-y-2">
                          {task.checklist.map((item) => (
                            <label
                              key={item.id}
                              className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 text-sm text-[#4f433d]"
                            >
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => handleToggleChecklist(day.date, task.id, item.id)}
                                className="h-4 w-4 accent-[#7b5f55]"
                              />
                              <span className={item.completed ? 'line-through opacity-60' : ''}>
                                {item.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[22px] border border-dashed border-[#dfd0c7] bg-[#fcfaf8] p-4 text-center text-sm text-[#9b8a82]">
                  Nothing planned here yet                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WeeklyPage;