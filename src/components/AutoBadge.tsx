import { Bot } from 'lucide-react';

export function AutoBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
      <Bot className="h-3 w-3" />
      Auto
    </span>
  );
}