/** число  в CSS цвет **/
export function intToCssColor(colorInt: number): string {
  return `#${colorInt.toString(16).padStart(6, "0")}`.toUpperCase();
}
