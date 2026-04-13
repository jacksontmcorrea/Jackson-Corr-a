export type LogType = 'info' | 'success' | 'warning' | 'error';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: LogType;
  message: string;
}

export type OperationStatus = 'idle' | 'running' | 'success' | 'error';

export interface OperationState {
  status: OperationStatus;
  logs: LogEntry[];
}

export interface AppState {
  gbakPath: string;
  gfixPath: string;
  dbUser: string;
  dbPass: string;
  backup: {
    src: string;
    dest: string;
    state: OperationState;
  };
  restore: {
    fbk: string;
    dest: string;
    state: OperationState;
  };
  repair: {
    src: string;
    state: OperationState;
  };
}
