import type { SVGProps } from "react";

export type ForjaCustomIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  stroke?: number;
};

export function ForjaResistanceBandIcon({
  size = 24,
  stroke = 1.8,
  ...props
}: ForjaCustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 9c2-2 4-3 7-3s5 1 7 3" />
      <path d="M5 15c2 2 4 3 7 3s5-1 7-3" />
      <path d="M5 9v6M19 9v6" />
      <path d="M3.5 8.5v7M20.5 8.5v7" />
    </svg>
  );
}

export function ForjaKettlebellIcon({
  size = 24,
  stroke = 1.8,
  ...props
}: ForjaCustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
      <path d="M8 8h8" />
      <path d="M8 8c-2 1.3-3 3.6-3 6a7 7 0 0 0 14 0c0-2.4-1-4.7-3-6" />
      <path d="M9 17h6" />
    </svg>
  );
}

export function ForjaSledIcon({
  size = 24,
  stroke = 1.8,
  ...props
}: ForjaCustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 20h14" />
      <path d="M7 20c0-2 .8-3.5 2.5-4.5" />
      <path d="M17 20c0-2-.8-3.5-2.5-4.5" />
      <path d="M9.5 15.5h5" />
      <path d="M10 15.5V9h4v6.5" />
      <path d="M10 9 8 4M14 9l2-5" />
    </svg>
  );
}
