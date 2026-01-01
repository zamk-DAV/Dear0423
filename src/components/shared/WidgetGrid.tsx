'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
  MouseSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import { useWidgetStore } from '@/store/widgetStore';
import { WIDGET_REGISTRY } from '@/config/widgetConfig';
import { SortableItem } from './widgets/SortableItem';

export default function WidgetGrid() {
  const { order, setOrder } = useWidgetStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // 하이드레이션 문제 방지 (서버/클라이언트 불일치)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 센서 설정: 터치(모바일)와 마우스(PC) 모두 지원
  // activationConstraint: 실수로 드래그되는 것 방지 (5px 이상 움직여야 드래그 시작)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }), // 꾹 눌러야 드래그 (모바일 친화적)
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!mounted) return null; // 로딩 중엔 아무것도 안 보여줌 (깜빡임 방지)

  // 실제 렌더링할 위젯 리스트 필터링 (설정 파일에 있는 것만)
  const displayItems = order.filter(id => WIDGET_REGISTRY[id]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as string);
      const newIndex = order.indexOf(over.id as string);
      setOrder(arrayMove(order, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => setActiveId(active.id as string)}
    >
      <SortableContext items={displayItems} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-full max-w-5xl mx-auto pb-24">
          {displayItems.map((id) => (
            <SortableItem key={id} id={id}>
              {WIDGET_REGISTRY[id]}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
