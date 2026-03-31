import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type {
  StudyChecklistItem,
  StudyDay,
  StudyPlannerWeek,
  StudySubject,
  StudyTask,
} from '../../models/study.models';
const studySubjects: {
  value: StudySubject;
  label: string;
  badge: string;
  card: string;
  dot: string;
}[] = [
    {
      value: 'math',
      label: 'Math',
      badge: 'bg-[#dbe8ff] text-[#355c9a]',
      card: 'border-[#9dbcf0] bg-[#eef5ff]',
      dot: 'bg-[#5a8dee]',
    },
    {
      value: 'english',
      label: 'English',
      badge: 'bg-[#f7edc7] text-[#8a6a17]',
      card: 'border-[#dcc26c] bg-[#fff9e8]',
      dot: 'bg-[#d7b23f]',
    },
    {
      value: 'arabic',
      label: 'Arabic',
      badge: 'bg-[#d9eee7] text-[#3f7263]',
      card: 'border-[#95c7b4] bg-[#eef8f3]',
      dot: 'bg-[#5fa37f]',
    },
    {
      value: 'programming',
      label: 'Programming',
      badge: 'bg-[#eadcf4] text-[#765593]',
      card: 'border-[#c6a8df] bg-[#f7f1fb]',
      dot: 'bg-[#9a72c2]',
    },
    {
      value: 'online_course',
      label: 'Online course',
      badge: 'bg-[#f3dce7] text-[#8b5f73]',
      card: 'border-[#d9a8bf] bg-[#fcf1f6]',
      dot: 'bg-[#d987ad]',
    },
    {
      value: 'other',
      label: 'Other',
      badge: 'bg-[#ebe4de] text-[#6f625b]',
      card: 'border-[#bfaea3] bg-[#f8f5f2]',
      dot: 'bg-[#a99084]',
    },
  ];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getStartOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

function createStudyWeek(): StudyPlannerWeek {
  const start = getStartOfWeek(new Date());
  const days: StudyDay[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      date: date.toISOString(),
      dayName: dayNames[date.getDay()],
      tasks: [],
    };
  });

  return {
    id: 'study-current',
    weekStartDate: days[0].date,
    weekEndDate: days[6].date,
    days,
  };
}

const initialStudyWeek: StudyPlannerWeek = {
  ...createStudyWeek(),
  days: createStudyWeek().days.map((day, index) => {
    if (index === 1) {
      return {
        ...day,
        tasks: [
          {
            id: 's1',
            title: 'Math revision block',
            subject: 'math',
            notes: 'Focus on probability questions',
            checklist: [
              { id: 'sc1', text: 'Solve 10 timed questions', completed: true },
              { id: 'sc2', text: 'Review mistakes', completed: false },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };
    }

    if (index === 3) {
      return {
        ...day,
        tasks: [
          {
            id: 's2',
            title: 'English vocab review',
            subject: 'english',
            notes: 'Revise weak words from file',
            checklist: [
              { id: 'sc3', text: 'Quizlet session', completed: false },
              { id: 'sc4', text: 'Practice synonyms', completed: false },
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

function createChecklistItem(text: string): StudyChecklistItem {
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



function calculateTaskProgress(task: StudyTask) {
  if (task.checklist.length === 0) {
    return 0;
  }

  const completed = task.checklist.filter((item) => item.completed).length;
  return Math.round((completed / task.checklist.length) * 100);
}

function StudyPage() {
  const [studyWeek, setStudyWeek] = useState<StudyPlannerWeek>(initialStudyWeek);
  const [selectedDate, setSelectedDate] = useState<string>(initialStudyWeek.days[0].date);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<StudySubject>('math');
  const [notes, setNotes] = useState('');
  const [checklistInput, setChecklistInput] = useState('');
  const [draftChecklist, setDraftChecklist] = useState<StudyChecklistItem[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const dayDropdownRef = useRef<HTMLDivElement | null>(null);
  const subjectDropdownRef = useRef<HTMLDivElement | null>(null);

  const overallProgress = useMemo(() => {
    const checklistItems = studyWeek.days.flatMap((day) =>
      day.tasks.flatMap((task) => task.checklist)
    );

    if (checklistItems.length === 0) {
      return 0;
    }

    const completed = checklistItems.filter((item) => item.completed).length;
    return Math.round((completed / checklistItems.length) * 100);
  }, [studyWeek]);

  const totalStudyTasks = useMemo(
    () => studyWeek.days.reduce((sum, day) => sum + day.tasks.length, 0),
    [studyWeek]
  );

  const completedChecklistCount = useMemo(() => {
    const checklistItems = studyWeek.days.flatMap((day) =>
      day.tasks.flatMap((task) => task.checklist)
    );

    return checklistItems.filter((item) => item.completed).length;
  }, [studyWeek]);

  const selectedDay =
    studyWeek.days.find((day) => day.date === selectedDate) ?? studyWeek.days[0];

  const selectedSubjectMeta =
    studySubjects.find((subjectOption) => subjectOption.value === subject) ?? studySubjects[0];


  const resetForm = () => {
    setTitle('');
    setSubject('math');
    setNotes('');
    setChecklistInput('');
    setDraftChecklist([]);
    setEditingTaskId(null);
    setIsDayDropdownOpen(false);
    setIsSubjectDropdownOpen(false);
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

    setStudyWeek((prev) => ({
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
                  subject,
                  notes: trimmedNotes || undefined,
                  checklist: draftChecklist,
                  updatedAt: now,
                }
                : task
            ),
          };
        }

        const newTask: StudyTask = {
          id: crypto.randomUUID(),
          title: trimmedTitle || undefined,
          subject,
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
    setStudyWeek((prev) => ({
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dayDropdownRef.current &&
        !dayDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDayDropdownOpen(false);
      }

      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSubjectDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditTask = (task: StudyTask, dayDate: string) => {
    setSelectedDate(dayDate);
    setEditingTaskId(task.id);
    setTitle(task.title ?? '');
    const normalizedSubject = studySubjects.some(
      (subjectOption) => subjectOption.value === task.subject
    )
      ? (task.subject as StudySubject)
      : 'other';

    setSubject(normalizedSubject); setNotes(task.notes ?? '');
    setChecklistInput('');
    setDraftChecklist(task.checklist);
    setIsDayDropdownOpen(false);
    setIsSubjectDropdownOpen(false);
  };

  const handleToggleChecklist = (dayDate: string, taskId: string, checklistId: string) => {
    setStudyWeek((prev) => ({
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

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.24em] text-[#b08f82]">
            Study planner
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-[#3c312c]">
            Plan your study week with focus
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-[#eadfd7] bg-white px-4 py-3 shadow-sm">
          <span className="rounded-full bg-[#f1eef8] px-3 py-1 text-sm font-medium text-[#665d7c]">
            {totalStudyTasks} tasks
          </span>
          <span className="rounded-full bg-[#f8f5f2] px-3 py-1 text-sm font-medium text-[#6f625b]">
            {completedChecklistCount} completed checklist items
          </span>

          <div className="h-5 w-px bg-[#eadfd7]" />

          <div className="flex flex-wrap items-center gap-3">
            {studySubjects.map((subjectOption) => (
              <div
                key={subjectOption.value}
                className="inline-flex items-center gap-2 text-sm text-[#6f625b]"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${subjectOption.dot}`} />
                <span>{subjectOption.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-[#eadfd7] bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#3c312c]">
              {editingTaskId ? `Edit study task for ${selectedDay.dayName}` : `Add study task for ${selectedDay.dayName}`}
            </h3>
            <p className="mt-1 text-sm text-[#8d7b73]">
              Choose a day, pick a subject, and build a focused checklist.
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
                  <div className="p-2">
                    {studyWeek.days.map((day) => {
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
                            <span className="text-xs font-medium text-[#9b7d72]">Selected</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative" ref={subjectDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSubjectDropdownOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between rounded-2xl border bg-[#fffaf7] px-4 py-3 text-left text-[#3c312c] outline-none transition ${isSubjectDropdownOpen
                    ? 'border-[#c9aea1] shadow-[0_0_0_3px_rgba(201,174,161,0.12)]'
                    : 'border-[#eadfd7] hover:border-[#d8c7bd]'
                  }`}
                aria-haspopup="listbox"
                aria-expanded={isSubjectDropdownOpen}
              >
                <span className="inline-flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${selectedSubjectMeta.dot}`} />
                  <span className="text-sm font-medium">{selectedSubjectMeta.label}</span>
                </span>

                <span className="text-[#8d7b73]">
                  <ChevronDownIcon open={isSubjectDropdownOpen} />
                </span>
              </button>

              {isSubjectDropdownOpen ? (
                <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-[22px] border border-[#e2d4cc] bg-white shadow-[0_16px_40px_rgba(60,49,44,0.12)]">
                  <div className="p-2">
                    {studySubjects.map((subjectOption) => {
                      const isSelected = subjectOption.value === subject;

                      return (
                        <button
                          key={subjectOption.value}
                          type="button"
                          onClick={() => {
                            setSubject(subjectOption.value);
                            setIsSubjectDropdownOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${isSelected
                              ? 'bg-[#f7ece6] text-[#3c312c]'
                              : 'text-[#5f544d] hover:bg-[#fcf7f4]'
                            }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <span className={`h-2.5 w-2.5 rounded-full ${subjectOption.dot}`} />
                          <span className="flex-1">{subjectOption.label}</span>
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
                {editingTaskId ? 'Save changes' : 'Add study task'}
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
        </div>

        <div className="rounded-[28px] border border-[#eadfd7] bg-white p-5 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-[#b08f82]">Weekly progress</p>
          <h3 className="mt-2 text-3xl font-semibold text-[#3c312c]">{overallProgress}%</h3>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#f2e8e1]">
            <div
              className="h-full rounded-full bg-[#7b5f55] transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-[#6f625b]">
            This updates when you check items off in your study tasks.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {studyWeek.days.map((day) => (
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
                  const subjectMeta =
                    studySubjects.find((subjectOption) => subjectOption.value === task.subject) ??
                    studySubjects[studySubjects.length - 1];

                  const progress = calculateTaskProgress(task);

                  return (
                    <div
                      key={task.id}
                      className={`rounded-[24px] border-[1.5px] p-4 shadow-[0_1px_2px_rgba(60,49,44,0.04)] ${subjectMeta.card}`}
                    >
                     <div className="mb-3">
<div className="-ml-2 flex items-center justify-between gap-3">
  <div className="-mr-1 flex items-center gap-2">
        <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${subjectMeta.badge}`}
      >
        {subjectMeta.label}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleEditTask(task, day.date)}
        className="rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-[#7b5f55] transition hover:bg-white"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={() => handleDeleteTask(task.id, day.date)}
        className="rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-[#9b7d72] transition hover:bg-white"
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

                      <div className="mb-3">
                        <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#6f625b]">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/70">
                          <div
                            className="h-full rounded-full bg-[#7b5f55] transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
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

export default StudyPage;