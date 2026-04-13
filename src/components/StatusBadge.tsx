import React from 'react';
import { OperationStatus } from '../types';
import { cn } from '../lib/utils';
import { Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: OperationStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    idle: {
      icon: Clock,
      text: 'Aguardando...',
      className: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
    },
    running: {
      icon: Loader2,
      text: 'Executando...',
      className: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
    },
    success: {
      icon: CheckCircle2,
      text: 'Concluído!',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    error: {
      icon: AlertCircle,
      text: 'Erro na execução',
      className: 'bg-rose-50 text-rose-700 border-rose-200'
    }
  };

  const { icon: Icon, text, className } = config[status];

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold",
      className
    )}>
      <Icon className={cn("w-3.5 h-3.5", status === 'running' && "animate-spin")} />
      {text}
    </div>
  );
};
