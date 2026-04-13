import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { cn } from '../lib/utils';

interface LogBoxProps {
  logs: LogEntry[];
}

export const LogBox: React.FC<LogBoxProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div 
      ref={scrollRef}
      className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-xs h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700"
    >
      {logs.length === 0 && (
        <div className="text-zinc-600 italic">Nenhum log disponível...</div>
      )}
      {logs.map((log) => (
        <div key={log.id} className="mb-1 flex gap-2">
          <span className="text-zinc-500 shrink-0">[{log.timestamp}]</span>
          <span className={cn(
            "break-all",
            log.type === 'info' && "text-blue-400",
            log.type === 'success' && "text-emerald-400",
            log.type === 'warning' && "text-amber-400",
            log.type === 'error' && "text-rose-400"
          )}>
            {log.message}
          </span>
        </div>
      ))}
    </div>
  );
};
