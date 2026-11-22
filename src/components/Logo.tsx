import { useId } from "react";

/** Vector redraw of the supplied OTO mark; no raster or background rectangle. */
export function Logo({ className }: { className?: string }) {
  const gold = useId();
  return (
    <svg className={className} viewBox="0 0 900 340" role="img" aria-label="OTO">
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="0.8">
          <stop stopColor="#f2c58c" />
          <stop offset=".45" stopColor="#d99540" />
          <stop offset=".72" stopColor="#edb66e" />
          <stop offset="1" stopColor="#bb782e" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="34">
        <ellipse cx="164" cy="180" rx="145" ry="140" />
        <ellipse cx="736" cy="180" rx="145" ry="140" />
      </g>
      <g fill={`url(#${gold})`}>
        <path d="M300 52C320 24 381 2 437 4C476 5 490 22 475 42C465 56 448 61 433 69Q415 73 391 65L310 60Q296 60 300 52Z" />
        <path d="M411 61Q448 72 486 61L470 305Q468 327 451 327Q435 327 433 303Z" />
        <path d="M560 6C590 10 612 24 613 40C615 60 590 76 555 78L492 80C542 70 573 57 577 39C580 25 571 14 560 6Z" />
        <path d="M450 4C495 6 523 21 516 40C511 53 495 62 476 68C489 53 493 42 489 30C485 18 472 10 450 4Z" />
        <path d="M509 4C550 8 577 24 571 42C567 56 550 65 533 70C548 57 551 44 547 32C542 20 528 11 509 4Z" />
      </g>
    </svg>
  );
}
