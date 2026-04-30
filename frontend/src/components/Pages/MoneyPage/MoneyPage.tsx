/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { STORAGE_KEYS, loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { MoneyBoard, MoneyColumnId, MoneyItem } from '../../models/money.models';

const initialBoard: MoneyBoard = {
    items: {
        '1': {
            id: '1',
            title: 'Buy gym shoes',
            amount: 320,
            notes: 'Need a new pair for workouts',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        '2': {
            id: '2',
            title: 'Laser session payment',
            amount: 250,
            notes: 'Book and pay this month',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        '3': {
            id: '3',
            title: 'New desk lamp',
            amount: 180,
            notes: 'For the study setup',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        '4': {
            id: '4',
            title: 'Cute tote bag',
            amount: 90,
            notes: 'Only if budget allows',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    },
    columns: {
        all: {
            id: 'all',
            title: 'All Items',
            itemIds: ['1', '2'],
        },
        important: {
            id: 'important',
            title: 'Important',
            itemIds: ['3'],
        },
        secondary: {
            id: 'secondary',
            title: 'Secondary',
            itemIds: [],
        },
        bonus: {
            id: 'bonus',
            title: 'Bonus',
            itemIds: ['4'],
        },
    },
    columnOrder: ['all', 'important', 'secondary', 'bonus'],
};

const columnStyles: Record<MoneyColumnId, string> = {
    all: 'bg-[#fffaf7]',
    important: 'bg-[#fdf3ef]',
    secondary: 'bg-[#fcf7f3]',
    bonus: 'bg-[#faf4ef]',
};

type MoneyCardProps = {
    item: MoneyItem;
    columnId: MoneyColumnId;
    onDelete: (itemId: string, columnId: MoneyColumnId) => void;
    onEdit: (item: MoneyItem, columnId: MoneyColumnId) => void;
};

function MoneyCard({ item, columnId, onDelete, onEdit }: MoneyCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({
            id: item.id,
            data: {
                type: 'money-item',
                columnId,
            },
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`rounded-[22px] border border-[#eadfd7] bg-white p-4 shadow-sm transition ${isDragging ? 'scale-[0.98] opacity-60 shadow-md' : 'hover:shadow-md'
                }`}
        >
            <div
                className="cursor-pointer rounded-[18px] transition"
                onClick={() => onEdit(item, columnId)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onEdit(item, columnId);
                    }
                }}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-1 items-start gap-3">
                        <button
                            type="button"
                            className="mt-0.5 cursor-grab rounded-full px-1 text-[#b08f82] transition hover:bg-[#f7ece6] active:cursor-grabbing"
                            aria-label={`Drag ${item.title}`}
                            onClick={(event) => event.stopPropagation()}
                            onPointerDown={(event) => event.stopPropagation()}
                            {...attributes}
                            {...listeners}
                        >
                            ⋮⋮
                        </button>

                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-[#3c312c]">
                                {item.title}
                            </h3>

                            {item.notes ? (
                                <p className="mt-1 text-sm text-[#6f625b]">
                                    {item.notes}
                                </p>
                            ) : null}

                            {typeof item.amount === 'number' ? (
                                <div className="mt-3 inline-flex rounded-full bg-[#f6ebe5] px-3 py-1 text-sm font-medium text-[#7b5f55]">
                                    ₪{item.amount}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            onDelete(item.id, columnId);
                        }}
                        className="shrink-0 rounded-full border border-[#eadfd7] bg-white px-3 py-1 text-xs font-medium text-[#9b7d72] transition hover:bg-[#f9ece8] hover:text-[#7c5a50]"
                    >
                        Delete
                    </button>
                </div>
            </div>

        </div>
    );
}

type MoneyColumnProps = {
    columnId: MoneyColumnId;
    title: string;
    items: MoneyItem[];
    onDelete: (itemId: string, columnId: MoneyColumnId) => void;
    onEdit: (item: MoneyItem, columnId: MoneyColumnId) => void;
    onOpenAddForm: (columnId: MoneyColumnId) => void;
    activeColumnForForm: MoneyColumnId | null;
    editingItemId: string | null;
    titleValue: string;
    amountValue: string;
    notesValue: string;
    setTitleValue: Dispatch<SetStateAction<string>>;
    setAmountValue: Dispatch<SetStateAction<string>>;
    setNotesValue: Dispatch<SetStateAction<string>>;
    onSubmitForm: (event: FormEvent<HTMLFormElement>) => void;
    onCancelForm: () => void;
};

function MoneyColumnView({
    columnId,
    title,
    items,
    onDelete,
    onEdit,
    onOpenAddForm,
    activeColumnForForm,
    editingItemId,
    titleValue,
    amountValue,
    notesValue,
    setTitleValue,
    setAmountValue,
    setNotesValue,
    onSubmitForm,
    onCancelForm,
}: MoneyColumnProps) {
    const { setNodeRef } = useDroppable({
        id: columnId,
        data: {
            type: 'money-column',
            columnId,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`rounded-[28px] border border-[#eadfd7] p-4 shadow-sm ${columnStyles[columnId]}`}
        >
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#3c312c]">{title}</h3>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#9b7d72] shadow-sm">
                        {items.length}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => onOpenAddForm(columnId)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eadfd7] bg-white text-lg leading-none text-[#7b5f55] transition hover:bg-[#f7ece6]"
                    aria-label={`Add item to ${title}`}
                >
                    +
                </button>
            </div>

            {activeColumnForForm === columnId ? (
                <form
                    onSubmit={onSubmitForm}
                    className="mb-4 space-y-3 rounded-[22px] border border-[#eadfd7] bg-white p-3 shadow-sm"
                >
                    <input
                        type="text"
                        placeholder="What do you need to pay or buy?"
                        value={titleValue}
                        onChange={(event) => setTitleValue(event.target.value)}
                        className="w-full rounded-2xl border border-[#eadfd7] bg-[#fffaf7] px-4 py-3 text-[#3c312c] outline-none transition placeholder:text-[#a6948c] focus:border-[#c9aea1]"
                    />

                    <input
                        type="number"
                        placeholder="Amount"
                        value={amountValue}
                        onChange={(event) => setAmountValue(event.target.value)}
                        className="w-full rounded-2xl border border-[#eadfd7] bg-[#fffaf7] px-4 py-3 text-[#3c312c] outline-none transition placeholder:text-[#a6948c] focus:border-[#c9aea1]"
                    />

                    <textarea
                        placeholder="Notes (optional)"
                        value={notesValue}
                        onChange={(event) => setNotesValue(event.target.value)}
                        className="min-h-[90px] w-full rounded-2xl border border-[#eadfd7] bg-[#fffaf7] px-4 py-3 text-[#3c312c] outline-none transition placeholder:text-[#a6948c] focus:border-[#c9aea1]"
                    />

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="rounded-2xl bg-[#3c312c] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                        >
                            {editingItemId ? 'Save changes' : 'Add item'}
                        </button>

                        <button
                            type="button"
                            onClick={onCancelForm}
                            className="rounded-2xl border border-[#eadfd7] bg-[#fffaf7] px-4 py-2.5 text-sm font-medium text-[#6f625b] transition hover:bg-[#f7ece6]"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : null}

            <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <MoneyCard
                                key={item.id}
                                item={item}
                                columnId={columnId}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        ))
                    ) : (
                        <div className="rounded-[22px] border border-dashed border-[#dfd0c7] bg-white/70 p-4 text-center text-sm text-[#9b8a82]">
                            No items here yet
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}


function MoneyPage() {
    const [board, setBoard] = useState<MoneyBoard>(() =>
        loadFromLocalStorage<MoneyBoard>(STORAGE_KEYS.moneyBoard, initialBoard)
    );
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [activeColumnForForm, setActiveColumnForForm] = useState<MoneyColumnId | null>(null);
    useEffect(() => {
        saveToLocalStorage(STORAGE_KEYS.moneyBoard, board);
    }, [board]);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        })
    );
    const handleDragStart = (event: DragStartEvent) => {
        setActiveItemId(String(event.active.id));
    };
    const columnsWithItems = useMemo(() => {
        return board.columnOrder.map((columnId) => {
            const column = board.columns[columnId];
            const items = column.itemIds
                .map((itemId) => board.items[itemId])
                .filter(Boolean);

            return {
                ...column,
                items,
            };
        });
    }, [board]);


    const handleAddItem = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim() || !activeColumnForForm) {
            return;
        }

        const newId = crypto.randomUUID();
        const now = new Date().toISOString();

        const newItem: MoneyItem = {
            id: newId,
            title: title.trim(),
            amount: amount.trim() ? Number(amount) : undefined,
            notes: notes.trim() || undefined,
            createdAt: now,
            updatedAt: now,
        };

        setBoard((prev) => ({
            ...prev,
            items: {
                ...prev.items,
                [newId]: newItem,
            },
            columns: {
                ...prev.columns,
                [activeColumnForForm]: {
                    ...prev.columns[activeColumnForForm],
                    itemIds: [newId, ...prev.columns[activeColumnForForm].itemIds],
                },
            },
        }));

        setTitle('');
        setAmount('');
        setNotes('');
        setEditingItemId(null);
        setActiveColumnForForm(null);
    };

    const handleStartEdit = (item: MoneyItem, columnId: MoneyColumnId) => {
        setEditingItemId(item.id);
        setActiveColumnForForm(columnId);
        setTitle(item.title);
        setAmount(typeof item.amount === 'number' ? String(item.amount) : '');
        setNotes(item.notes ?? '');
    };

    const handleCancelForm = () => {
        setEditingItemId(null);
        setActiveColumnForForm(null);
        setTitle('');
        setAmount('');
        setNotes('');
    };

    const handleUpdateItem = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!editingItemId || !title.trim()) {
            return;
        }

        setBoard((prev) => ({
            ...prev,
            items: {
                ...prev.items,
                [editingItemId]: {
                    ...prev.items[editingItemId],
                    title: title.trim(),
                    amount: amount.trim() ? Number(amount) : undefined,
                    notes: notes.trim() || undefined,
                    updatedAt: new Date().toISOString(),
                },
            },
        }));

        handleCancelForm();
    };

    const handleOpenAddForm = (columnId: MoneyColumnId) => {
        if (activeColumnForForm === columnId && !editingItemId) {
            handleCancelForm();
            return;
        }

        setEditingItemId(null);
        setTitle('');
        setAmount('');
        setNotes('');
        setActiveColumnForForm(columnId);
    };

    const handleDeleteItem = (itemId: string, _columnId: MoneyColumnId) => {
        setBoard((prev) => {
            const updatedItems = { ...prev.items };
            delete updatedItems[itemId];

            const updatedColumns = { ...prev.columns };

            (Object.keys(updatedColumns) as MoneyColumnId[]).forEach((currentColumnId) => {
                updatedColumns[currentColumnId] = {
                    ...updatedColumns[currentColumnId],
                    itemIds: updatedColumns[currentColumnId].itemIds.filter((id) => id !== itemId),
                };
            });

            return {
                ...prev,
                items: updatedItems,
                columns: updatedColumns,
            };
        });
    };

    const findColumnByItemId = (itemId: string): MoneyColumnId | null => {
        for (const columnId of board.columnOrder) {
            if (board.columns[columnId].itemIds.includes(itemId)) {
                return columnId;
            }
        }

        return null;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveItemId(null);

        if (!over) {
            return;
        }

        const activeItemId = String(active.id);
        const overId = String(over.id);

        const sourceColumnId = findColumnByItemId(activeItemId);
        const targetColumnId = findColumnByItemId(overId) ?? (over.id as MoneyColumnId);

        if (!sourceColumnId || !targetColumnId) {
            return;
        }

        setBoard((prev) => {
            const sourceColumn = prev.columns[sourceColumnId];
            const targetColumn = prev.columns[targetColumnId];

            const sourceIndex = sourceColumn.itemIds.indexOf(activeItemId);
            const targetIndexInTargetColumn = targetColumn.itemIds.indexOf(overId);

            if (sourceColumnId === targetColumnId) {
                if (sourceIndex === -1) {
                    return prev;
                }

                const newItemIds =
                    targetIndexInTargetColumn === -1
                        ? sourceColumn.itemIds
                        : arrayMove(sourceColumn.itemIds, sourceIndex, targetIndexInTargetColumn);

                return {
                    ...prev,
                    columns: {
                        ...prev.columns,
                        [sourceColumnId]: {
                            ...sourceColumn,
                            itemIds: newItemIds,
                        },
                    },
                };
            }

            const newSourceItemIds = sourceColumn.itemIds.filter((id) => id !== activeItemId);

            const newTargetItemIds = [...targetColumn.itemIds];
            const insertAt = targetIndexInTargetColumn === -1 ? newTargetItemIds.length : targetIndexInTargetColumn;
            newTargetItemIds.splice(insertAt, 0, activeItemId);

            return {
                ...prev,
                columns: {
                    ...prev.columns,
                    [sourceColumnId]: {
                        ...sourceColumn,
                        itemIds: newSourceItemIds,
                    },
                    [targetColumnId]: {
                        ...targetColumn,
                        itemIds: newTargetItemIds,
                    },
                },
                items: {
                    ...prev.items,
                    [activeItemId]: {
                        ...prev.items[activeItemId],
                        updatedAt: new Date().toISOString(),
                    },
                },
            };
        });
    };

    const handleDragCancel = () => {
        setActiveItemId(null);
    };

    return (
        <section className="space-y-6">
            <div>
                <p className="mb-2 text-sm uppercase tracking-[0.24em] text-[#b08f82]">
                    Money planner
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-[#3c312c]">
                    Things to buy now / pay now
                </h2>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >                <div className="grid gap-4 xl:grid-cols-4">
                    {columnsWithItems.map((column) => (
                        <MoneyColumnView
                            key={column.id}
                            columnId={column.id}
                            title={column.title}
                            items={column.items}
                            onDelete={handleDeleteItem}
                            onEdit={handleStartEdit}
                            onOpenAddForm={handleOpenAddForm}
                            activeColumnForForm={activeColumnForForm}
                            editingItemId={editingItemId}
                            titleValue={title}
                            amountValue={amount}
                            notesValue={notes}
                            setTitleValue={setTitle}
                            setAmountValue={setAmount}
                            setNotesValue={setNotes}
                            onSubmitForm={editingItemId ? handleUpdateItem : handleAddItem}
                            onCancelForm={handleCancelForm}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeItemId && board.items[activeItemId] ? (
                        <div className="rotate-[1deg] rounded-[22px] border border-[#eadfd7] bg-white p-4 shadow-[0_20px_50px_rgba(60,49,44,0.18)]">
                            <h3 className="text-base font-semibold text-[#3c312c]">
                                {board.items[activeItemId].title}
                            </h3>
                            {board.items[activeItemId].notes ? (
                                <p className="mt-1 text-sm text-[#6f625b]">
                                    {board.items[activeItemId].notes}
                                </p>
                            ) : null}

                            {typeof board.items[activeItemId].amount === 'number' ? (
                                <div className="mt-3 inline-flex rounded-full bg-[#f6ebe5] px-3 py-1 text-sm font-medium text-[#7b5f55]">
                                    ₪{board.items[activeItemId].amount}
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </section>
    );
}


export default MoneyPage;