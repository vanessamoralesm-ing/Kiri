import { twMerge } from "tailwind-merge";

/** Combina variantes sin perder la prioridad de los estilos posteriores. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}
