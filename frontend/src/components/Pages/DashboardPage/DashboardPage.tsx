import { Link } from "react-router-dom";
import { useMemo } from 'react';
import dashboardBanner from "../../../assets/dashboard-banner.png";
import type { MoneyBoard } from '../../models/money.models';
import type { WeeklyPlannerWeek } from '../../models/weekly.models';
import type { StudyPlannerWeek } from '../../models/study.models';
import { STORAGE_KEYS, loadFromLocalStorage } from '../../utils/localStorage';



function DashboardPage() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });


    const moneyBoard = useMemo(
        () =>
            loadFromLocalStorage<MoneyBoard>(STORAGE_KEYS.moneyBoard, {
                items: {},
                columns: {
                    all: { id: 'all', title: 'All Items', itemIds: [] },
                    important: { id: 'important', title: 'Important', itemIds: [] },
                    secondary: { id: 'secondary', title: 'Secondary', itemIds: [] },
                    bonus: { id: 'bonus', title: 'Bonus', itemIds: [] },
                },
                columnOrder: ['all', 'important', 'secondary', 'bonus'],
            }),
        []
    );

    const weeklyWeek = useMemo(
        () =>
            loadFromLocalStorage<WeeklyPlannerWeek>(STORAGE_KEYS.weeklyWeek, {
                id: 'weekly-empty',
                weekStartDate: '',
                weekEndDate: '',
                days: [],
            }),
        []
    );

    const studyWeek = useMemo(
        () =>
            loadFromLocalStorage<StudyPlannerWeek>(STORAGE_KEYS.studyWeek, {
                id: 'study-empty',
                weekStartDate: '',
                weekEndDate: '',
                days: [],
            }),
        []
    );

    const weeklyTaskCount = weeklyWeek.days.reduce((sum, day) => sum + day.tasks.length, 0);

    const weeklyCompletedChecklistCount = weeklyWeek.days.reduce(
        (sum, day) =>
            sum +
            day.tasks.reduce(
                (taskSum, task) => taskSum + task.checklist.filter((item) => item.completed).length,
                0
            ),
        0
    );

    const studyTaskCount = studyWeek.days.reduce((sum, day) => sum + day.tasks.length, 0);

    const studyCompletedChecklistCount = studyWeek.days.reduce(
        (sum, day) =>
            sum +
            day.tasks.reduce(
                (taskSum, task) => taskSum + task.checklist.filter((item) => item.completed).length,
                0
            ),
        0
    );

    const moneyItemCount = Object.keys(moneyBoard.items).length;
    const importantMoneyCount = moneyBoard.columns.important.itemIds.length;

    const plannerCards = [
        {
            label: "Weekly planner",
            title: "Weekly flow",
            value: `${weeklyTaskCount} tasks`,
            detail: `${weeklyCompletedChecklistCount} checklist items completed`,
            description: "Keep your week soft, clear, and easy to follow.",
            href: "/weekly",
        },
        {
            label: "Study planner",
            title: "Study focus",
            value: `${studyTaskCount} tasks`,
            detail: `${studyCompletedChecklistCount} checklist items done`,
            description: "Track revision, practice, and what still needs attention.",
            href: "/study",
        },
        {
            label: "Money planner",
            title: "Money decisions",
            value: `${moneyItemCount} items`,
            detail: `${importantMoneyCount} marked important`,
            description: "See what matters now and what can wait a little.",
            href: "/money",
        },
    ];

    return (
        <section className="space-y-6">
            <div className="relative overflow-hidden rounded-[32px] border border-[#eadfd7] bg-white shadow-[0_18px_45px_rgba(97,72,57,0.08)]">
                <img
                    src={dashboardBanner}
                    alt="dashboard banner"
            className="h-[300px] w-full object-cover object-[45%_56%] transition-transform duration-700 ease-out hover:scale-[1.01]"/>

                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5" />

<div className="absolute right-4 top-4 z-10 flex max-w-[calc(100%-2rem)] flex-col items-end gap-3 md:right-6 md:top-6 md:max-w-[420px]">                    <div className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-[#5f524b] shadow-[0_8px_24px_rgba(60,49,44,0.08)] backdrop-blur-md">
                        {formattedDate}
                    </div>

                    <div className="rounded-full border border-[#eadfd7] bg-[#fcf7f3]/90 px-4 py-2 text-sm font-medium text-[#8c6f62] shadow-[0_8px_24px_rgba(60,49,44,0.06)] backdrop-blur-md">
                        3 planner spaces ready
                    </div>
                </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
                {plannerCards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.href}
                        className="group rounded-[30px] border border-[#eadfd7] bg-white p-5 shadow-[0_10px_30px_rgba(97,72,57,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(97,72,57,0.08)]"
                    >
                        <p className="text-sm text-[#b08f82]">{card.label}</p>
                        <div className="mt-3 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-[#3c312c]">{card.title}</h3>
                                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#5a463d]">
                                    {card.value}
                                </p>
                            </div>
                            <span className="rounded-full border border-[#eadfd7] bg-[#fcf7f3] px-3 py-1 text-xs font-medium text-[#8d6d62]">
                                Open
                            </span>
                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f4ebe5]">
                            <div className="h-full w-2/3 rounded-full bg-[#d9b8a7]" />
                        </div>

                        <p className="mt-3 text-sm font-medium text-[#7d665c]">{card.detail}</p>
                        <p className="mt-2 text-sm leading-6 text-[#6f625b]">{card.description}</p>
                    </Link>
                ))}
            </div>

<div className="grid gap-5">
                    <div className="rounded-[30px] border border-[#eadfd7] bg-white p-6 shadow-[0_10px_28px_rgba(97,72,57,0.05)]">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-[#b08f82]">This week overview</p>

                        </div>

                        <span className="rounded-full border border-[#eadfd7] bg-[#fbf6f2] px-3 py-1 text-xs font-medium text-[#8e766a]">
                            Weekly snapshot
                        </span>
                    </div>

                    <div className="mt-5 space-y-4">
                        <div className="rounded-[22px] border border-[#f0e4dc] bg-[#fcf8f5] p-4">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-[#4f4038]">Weekly planner</p>
                                <span className="text-sm font-semibold text-[#8d6d62]">
                                    {weeklyTaskCount} tasks
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-[#6a5b54]">
                                {weeklyCompletedChecklistCount} checklist items completed
                            </p>
                        </div>

                        <div className="rounded-[22px] border border-[#f0e4dc] bg-[#fcf8f5] p-4">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-[#4f4038]">Study planner</p>
                                <span className="text-sm font-semibold text-[#8d6d62]">
                                    {studyTaskCount} tasks
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-[#6a5b54]">
                                {studyCompletedChecklistCount} checklist items done
                            </p>
                        </div>

                        <div className="rounded-[22px] border border-[#f0e4dc] bg-[#fcf8f5] p-4">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-[#4f4038]">Money planner</p>
                                <span className="text-sm font-semibold text-[#8d6d62]">
                                    {moneyItemCount} items
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-[#6a5b54]">
                                {importantMoneyCount} marked important right now
                            </p>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="text-[#6a5b54]">Overall weekly rhythm</span>
                                <span className="font-semibold text-[#8d6d62]">71%</span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-[#f4ebe5]">
                                <div className="h-full w-[71%] rounded-full bg-[#d9b8a7]" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default DashboardPage;