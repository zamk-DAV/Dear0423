'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils'; // clsx + tailwind-merge 유틸리티 (곧 만들 예정)

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1, // 드래그 중인 아이템을 맨 위로
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "touch-none select-none transition-shadow duration-200", // 터치 충돌 방지
        isDragging && "scale-105 shadow-2xl opacity-90 cursor-grabbing"
      )}
    >
      {children}
    </div>
  );
}
