import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isSameDay } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupMessagesByDate(messages: any[]) {
  const groups: { [key: string]: any[] } = {};
  
  messages.forEach((msg) => {
    const date = format(new Date(msg.created_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);
  });
  
  return groups;
}