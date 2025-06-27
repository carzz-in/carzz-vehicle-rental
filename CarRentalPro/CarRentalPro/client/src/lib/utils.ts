import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

export function formatDuration(startDate: Date | string, endDate: Date | string): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffMs = end.getTime() - start.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(diffHours / 24);
    const hours = diffHours % 24;
    return `${days} day${days !== 1 ? 's' : ''}${hours > 0 ? ` ${hours}h` : ''}`;
  }
}

export function calculateBookingCost(
  pricePerHour: string | number, 
  startDate: Date | string, 
  endDate: Date | string
): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const hourlyRate = typeof pricePerHour === 'string' ? parseFloat(pricePerHour) : pricePerHour;
  
  const diffMs = end.getTime() - start.getTime();
  const diffHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60))); // Minimum 1 hour
  
  return diffHours * hourlyRate;
}
