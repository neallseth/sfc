import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAsUSD(number: number) {
  const integer = number % 1 === 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: integer ? 0 : 2,
    maximumFractionDigits: integer ? 0 : 2,
  }).format(number);
}
