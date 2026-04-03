import { useEffect, useRef, useState } from 'react';
import {
  STORAGE_KEYS,
  loadFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from '../../utils/localStorage';

type ThemeMode = 'light' | 'soft' | 'dark';
type DensityMode = 'spacious' | 'balanced' | 'compact';
type DefaultPage = 'dashboard' | 'weekly' | 'study' | 'money';
type WeekStart = 'sunday' | 'monday';

type PlannerSettings = {
  theme: ThemeMode;
  density: DensityMode;
  defaultPage: DefaultPage;
  weekStart: WeekStart;
};

const defaultSettings: PlannerSettings = {
  theme: 'soft',
  density: 'balanced',
  defaultPage: 'dashboard',
  weekStart: 'sunday',
};

type Option<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

const themeOptions: Option<ThemeMode>[] = [
  { value: 'light', label: 'Light', description: 'Bright and clean' },
  { value: 'soft', label: 'Soft', description: 'Warm and calm' },
  { value: 'dark', label: 'Dark', description: 'Low-light and focused' },
];

const densityOptions: Option<DensityMode>[] = [
  { value: 'spacious', label: 'Spacious', description: 'More breathing room' },
  { value: 'balanced', label: 'Balanced', description: 'A soft middle ground' },
  { value: 'compact', label: 'Compact', description: 'Tighter layout' },
];

const defaultPageOptions: Option<DefaultPage>[] = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'study', label: 'Study' },
  { value: 'money', label: 'Money' },
];

const weekStartOptions: Option<WeekStart>[] = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
];

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

type SettingsDropdownProps<T extends string> = {
  value: T;
  options: Option<T>[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: T) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
};

function SettingsDropdown<T extends string>({
  value,
  options,
  open,
  onToggle,
  onSelect,
  dropdownRef,
}: SettingsDropdownProps<T>) {
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="relative min-w-[220px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-2xl border bg-[#fffaf7] px-4 py-3 text-left text-[#3c312c] outline-none transition ${open
            ? 'border-[#c9aea1] shadow-[0_0_0_3px_rgba(201,174,161,0.12)]'
            : 'border-[#eadfd7] hover:border-[#d8c7bd]'
          }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex flex-col">
          <span className="text-sm font-medium">{selectedOption.label}</span>
          {selectedOption.description ? (
            <span className="mt-0.5 text-xs text-[#8d7b73]">
              {selectedOption.description}
            </span>
          ) : null}
        </span>

        <span className="text-[#8d7b73]">
          <ChevronDownIcon open={open} />
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-[22px] border border-[#e2d4cc] bg-white shadow-[0_16px_40px_rgba(60,49,44,0.12)]">
          <div className="p-2">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSelect(option.value)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${isSelected
                      ? 'bg-[#f7ece6] text-[#3c312c]'
                      : 'text-[#5f544d] hover:bg-[#fcf7f4]'
                    }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description ? (
                      <span className="mt-0.5 text-xs text-[#8d7b73]">
                        {option.description}
                      </span>
                    ) : null}
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
  );
}

function SettingsPage() {
  const savedSettings = loadFromLocalStorage<PlannerSettings>(
    STORAGE_KEYS.settings,
    defaultSettings
  );

  const [theme, setTheme] = useState<ThemeMode>(savedSettings.theme);
  const [density, setDensity] = useState<DensityMode>(savedSettings.density);
  const [defaultPage, setDefaultPage] = useState<DefaultPage>(savedSettings.defaultPage);
  const [weekStart, setWeekStart] = useState<WeekStart>(savedSettings.weekStart);

  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isDensityOpen, setIsDensityOpen] = useState(false);
  const [isDefaultPageOpen, setIsDefaultPageOpen] = useState(false);
  const [isWeekStartOpen, setIsWeekStartOpen] = useState(false);

  const themeDropdownRef = useRef<HTMLDivElement | null>(null);
  const densityDropdownRef = useRef<HTMLDivElement | null>(null);
  const defaultPageDropdownRef = useRef<HTMLDivElement | null>(null);
  const weekStartDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', theme);
    root.setAttribute('data-density', density);
    root.setAttribute('data-default-page', defaultPage);
    root.setAttribute('data-week-start', weekStart);
  }, [theme, density, defaultPage, weekStart]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.settings, {
      theme,
      density,
      defaultPage,
      weekStart,
    });
  }, [theme, density, defaultPage, weekStart]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsThemeOpen(false);
      }

      if (
        densityDropdownRef.current &&
        !densityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDensityOpen(false);
      }

      if (
        defaultPageDropdownRef.current &&
        !defaultPageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDefaultPageOpen(false);
      }

      if (
        weekStartDropdownRef.current &&
        !weekStartDropdownRef.current.contains(event.target as Node)
      ) {
        setIsWeekStartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const resetSettings = () => {
    setTheme(defaultSettings.theme);
    setDensity(defaultSettings.density);
    setDefaultPage(defaultSettings.defaultPage);
    setWeekStart(defaultSettings.weekStart);

    setIsThemeOpen(false);
    setIsDensityOpen(false);
    setIsDefaultPageOpen(false);
    setIsWeekStartOpen(false);

    removeFromLocalStorage(STORAGE_KEYS.settings);
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.24em] text-[#b08f82]">
          Settings
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-[#3c312c]">
          Customize your planner
        </h2>
        <p className="mt-2 max-w-2xl text-[#6f625b]">
          Adjust how your planner looks and behaves so it fits your flow.
        </p>
      </div>

      <div className="rounded-[24px] border border-[#eadfd7] bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#f8f5f2] px-3 py-1 text-sm font-medium text-[#6f625b]">
            Theme: {theme}
          </span>
          <span className="rounded-full bg-[#f8f5f2] px-3 py-1 text-sm font-medium text-[#6f625b]">
            Density: {density}
          </span>
          <span className="rounded-full bg-[#f8f5f2] px-3 py-1 text-sm font-medium text-[#6f625b]">
            Default page: {defaultPage}
          </span>
          <span className="rounded-full bg-[#f8f5f2] px-3 py-1 text-sm font-medium text-[#6f625b]">
            Week starts: {weekStart}
          </span>
        </div>
      </div>

      <div className="rounded-[30px] border border-[#eadfd7] bg-white p-6 shadow-[0_10px_28px_rgba(97,72,57,0.05)]">
        <p className="text-sm text-[#b08f82]">Appearance</p>
        <h3 className="mt-2 text-xl font-semibold text-[#3c312c]">
          Look & feel
        </h3>

        <div className="mt-5 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#4f4038]">Theme</p>
              <p className="text-sm text-[#6f625b]">
                Choose your interface style
              </p>
            </div>

            <SettingsDropdown
              value={theme}
              options={themeOptions}
              open={isThemeOpen}
              onToggle={() => setIsThemeOpen((prev) => !prev)}
              onSelect={(value) => {
                setTheme(value);
                setIsThemeOpen(false);
              }}
              dropdownRef={themeDropdownRef}
            />
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#4f4038]">
                Layout density
              </p>
              <p className="text-sm text-[#6f625b]">
                Control spacing and compactness
              </p>
            </div>

            <SettingsDropdown
              value={density}
              options={densityOptions}
              open={isDensityOpen}
              onToggle={() => setIsDensityOpen((prev) => !prev)}
              onSelect={(value) => {
                setDensity(value);
                setIsDensityOpen(false);
              }}
              dropdownRef={densityDropdownRef}
            />
          </div>
        </div>
      </div>

      <div className="rounded-[30px] border border-[#eadfd7] bg-white p-6 shadow-[0_10px_28px_rgba(97,72,57,0.05)]">
        <p className="text-sm text-[#b08f82]">Planner behavior</p>
        <h3 className="mt-2 text-xl font-semibold text-[#3c312c]">
          How your planner works
        </h3>

        <div className="mt-5 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#4f4038]">
                Default page
              </p>
              <p className="text-sm text-[#6f625b]">
                Where you land when opening the app
              </p>
            </div>

            <SettingsDropdown
              value={defaultPage}
              options={defaultPageOptions}
              open={isDefaultPageOpen}
              onToggle={() => setIsDefaultPageOpen((prev) => !prev)}
              onSelect={(value) => {
                setDefaultPage(value);
                setIsDefaultPageOpen(false);
              }}
              dropdownRef={defaultPageDropdownRef}
            />
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#4f4038]">
                Week starts on
              </p>
              <p className="text-sm text-[#6f625b]">
                Choose your weekly structure
              </p>
            </div>

            <SettingsDropdown
              value={weekStart}
              options={weekStartOptions}
              open={isWeekStartOpen}
              onToggle={() => setIsWeekStartOpen((prev) => !prev)}
              onSelect={(value) => {
                setWeekStart(value);
                setIsWeekStartOpen(false);
              }}
              dropdownRef={weekStartDropdownRef}
            />
          </div>
        </div>
      </div>

      <div className="rounded-[30px] border border-[#eadfd7] bg-white p-6 shadow-[0_10px_28px_rgba(97,72,57,0.05)]">
        <p className="text-sm text-[#b08f82]">Data</p>
        <h3 className="mt-2 text-xl font-semibold text-[#3c312c]">
          Manage your data
        </h3>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#4f4038]">
              Reset planners
            </p>
            <p className="text-sm text-[#6f625b]">
              Reset the current frontend settings back to default values.
            </p>
          </div>

          <button
            type="button"
            onClick={resetSettings}
            className="rounded-full border border-[#e6cfc3] bg-[#fdf3ef] px-4 py-2 text-sm font-medium text-[#a05c4d] transition hover:bg-[#f8e6df]"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

export default SettingsPage;