
import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <div
      className="rounded-2xl border border-[#DADDD7]/80 bg-[#F0F0EC] p-5
        shadow-[5px_5px_12px_rgba(32,45,48,0.05),-5px_-5px_12px_rgba(255,255,255,0.7)]
        dark:border-[#34413C] dark:bg-[#1D2624]
        dark:shadow-[4px_4px_12px_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#617074] dark:text-[#9BAAA3]">
          {title}
        </p>

        <div className="flex size-10 items-center justify-center rounded-xl
          bg-[#DCE8DF] text-[#285B57]
          dark:bg-[#2B4038] dark:text-[#A9D4C5]"
        >
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-tight text-[#202D30] dark:text-[#E7ECE8]">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#617074] dark:text-[#9BAAA3]">
        {description}
      </p>
    </div>
  );
}
