/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { 
  Database, 
  Save, 
  RotateCcw, 
  Wrench, 
  Settings, 
  FolderOpen, 
  Play, 
  ShieldCheck, 
  Info,
  Terminal,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LogBox } from './components/LogBox';
import { StatusBadge } from './components/StatusBadge';
import { AppState, LogType, OperationStatus } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<AppState>({
    gbakPath: 'C:\\Program Files\\Firebird\\Firebird_3_0\\gbak.exe',
    gfixPath: 'C:\\Program Files\\Firebird\\Firebird_3_0\\gfix.exe',
    dbUser: 'SYSDBA',
    dbPass: 'masterkey',
    backup: {
      src: '',
      dest: '',
      state: { status: 'idle', logs: [] }
    },
    restore: {
      fbk: '',
      dest: '',
      state: { status: 'idle', logs: [] }
    },
    repair: {
      src: '',
      state: { status: 'idle', logs: [] }
    }
  });

  const addLog = useCallback((operation: 'backup' | 'restore' | 'repair', type: LogType, message: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const id = Math.random().toString(36).substring(7);
    
    setState(prev => ({
      ...prev,
      [operation]: {
        ...prev[operation],
        state: {
          ...prev[operation].state,
          logs: [...prev[operation].state.logs, { id, timestamp, type, message }]
        }
      }
    }));
  }, []);

  const updateStatus = useCallback((operation: 'backup' | 'restore' | 'repair', status: OperationStatus) => {
    setState(prev => ({
      ...prev,
      [operation]: {
        ...prev[operation],
        state: {
          ...prev[operation].state,
          status
        }
      }
    }));
  }, []);

  const simulateOperation = async (operation: 'backup' | 'restore' | 'repair', steps: { message: string, type: LogType, delay: number }[]) => {
    updateStatus(operation, 'running');
    setState(prev => ({
      ...prev,
      [operation]: {
        ...prev[operation],
        state: { ...prev[operation].state, logs: [] }
      }
    }));

    addLog(operation, 'info', `Iniciando operação de ${operation}...`);

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      addLog(operation, step.type, step.message);
    }

    updateStatus(operation, 'success');
  };

  const handleBackup = () => {
    if (!state.backup.src || !state.backup.dest) return;
    simulateOperation('backup', [
      { message: `GBAK: ${state.gbakPath}`, type: 'info', delay: 500 },
      { message: `Usuário: ${state.dbUser}`, type: 'info', delay: 200 },
      { message: `Senha: ${'*'.repeat(state.dbPass.length)}`, type: 'info', delay: 200 },
      { message: `Banco de Dados: ${state.backup.src}`, type: 'info', delay: 300 },
      { message: 'Conectando ao banco de dados...', type: 'info', delay: 800 },
      { message: 'Autenticação bem-sucedida!', type: 'success', delay: 400 },
      { message: 'Iniciando extração de metadados...', type: 'info', delay: 1000 },
      { message: 'Processando tabelas (25%)...', type: 'info', delay: 800 },
      { message: 'Processando índices (50%)...', type: 'info', delay: 800 },
      { message: 'Processando dados (75%)...', type: 'info', delay: 1200 },
      { message: 'Backup concluído com sucesso!', type: 'success', delay: 500 },
      { message: `Arquivo salvo em: ${state.backup.dest}`, type: 'success', delay: 200 }
    ]);
  };

  const handleRestore = () => {
    if (!state.restore.fbk || !state.restore.dest) return;
    simulateOperation('restore', [
      { message: `GBAK: ${state.gbakPath}`, type: 'info', delay: 500 },
      { message: `Usuário: ${state.dbUser}`, type: 'info', delay: 200 },
      { message: `Senha: ${'*'.repeat(state.dbPass.length)}`, type: 'info', delay: 200 },
      { message: 'Lendo arquivo de backup...', type: 'info', delay: 800 },
      { message: 'Arquivo validado!', type: 'success', delay: 400 },
      { message: 'Criando novo banco de dados...', type: 'info', delay: 1000 },
      { message: 'Restaurando metadados...', type: 'info', delay: 800 },
      { message: 'Restaurando dados (50%)...', type: 'info', delay: 1200 },
      { message: 'Reconstruindo índices...', type: 'info', delay: 1000 },
      { message: 'Restauração finalizada!', type: 'success', delay: 500 },
      { message: `Banco de dados pronto em: ${state.restore.dest}`, type: 'success', delay: 200 }
    ]);
  };

  const handleRepair = () => {
    if (!state.repair.src) return;
    simulateOperation('repair', [
      { message: `GFIX: ${state.gfixPath}`, type: 'info', delay: 500 },
      { message: `Usuário: ${state.dbUser}`, type: 'info', delay: 200 },
      { message: `Senha: ${'*'.repeat(state.dbPass.length)}`, type: 'info', delay: 200 },
      { message: 'AVISO: Analisando integridade estrutural...', type: 'warning', delay: 800 },
      { message: '[1/2] Executando gfix -v -f...', type: 'info', delay: 1200 },
      { message: 'Erros encontrados e marcados para correção.', type: 'warning', delay: 600 },
      { message: '[2/2] Executando gfix -m -i...', type: 'info', delay: 1500 },
      { message: 'Mend concluído com sucesso!', type: 'success', delay: 800 },
      { message: 'RECOMENDAÇÃO: Realize um Backup e Restore para consolidar o reparo.', type: 'warning', delay: 400 }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-zinc-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-bottom border-zinc-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">SUPORTE ECALC</h1>
              <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Firebird DB Manager v3.0</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-lg text-xs font-medium text-zinc-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Ambiente Seguro
            </div>
            <button className="p-2 text-zinc-400 hover:text-indigo-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-4 items-start">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <Info className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900">Guia Rápido</h3>
            <p className="text-sm text-indigo-700 leading-relaxed">
              Configure os caminhos dos executáveis do Firebird abaixo. Para operações de backup e restauração, certifique-se de que o serviço do Firebird esteja rodando e você tenha permissões de escrita nas pastas de destino.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Config */}
          <div className="lg:col-span-12">
            <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold">Configurações Globais</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                    Caminho do GBAK.exe
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={state.gbakPath}
                      onChange={(e) => setState(prev => ({ ...prev, gbakPath: e.target.value }))}
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button className="px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                    Caminho do GFIX.exe
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={state.gfixPath}
                      onChange={(e) => setState(prev => ({ ...prev, gfixPath: e.target.value }))}
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button className="px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700">
                    Usuário Firebird
                  </label>
                  <input 
                    type="text" 
                    value={state.dbUser}
                    onChange={(e) => setState(prev => ({ ...prev, dbUser: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700">
                    Senha Firebird
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={state.dbPass}
                      onChange={(e) => setState(prev => ({ ...prev, dbPass: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 pr-12 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Main Operations Grid */}
          <div className="lg:col-span-4 space-y-8">
            {/* Backup Card */}
            <OperationCard 
              title="Backup" 
              icon={<Save className="w-5 h-5" />} 
              accentColor="indigo"
              status={state.backup.state.status}
              onExecute={handleBackup}
              disabled={!state.backup.src || !state.backup.dest || state.backup.state.status === 'running'}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Banco de Dados (.FDB)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="C:\Dados\BANCO.FDB"
                      value={state.backup.src}
                      onChange={(e) => setState(prev => ({ ...prev, backup: { ...prev.backup, src: e.target.value } }))}
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pasta de Destino</label>
                  <input 
                    type="text" 
                    placeholder="C:\Backups\BANCO.FBK"
                    value={state.backup.dest}
                    onChange={(e) => setState(prev => ({ ...prev, backup: { ...prev.backup, dest: e.target.value } }))}
                    className="flex-1 w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>
              </div>
            </OperationCard>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Restore Card */}
            <OperationCard 
              title="Restauração" 
              icon={<RotateCcw className="w-5 h-5" />} 
              accentColor="emerald"
              status={state.restore.state.status}
              onExecute={handleRestore}
              disabled={!state.restore.fbk || !state.restore.dest || state.restore.state.status === 'running'}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Arquivo de Backup (.FBK)</label>
                  <input 
                    type="text" 
                    placeholder="C:\Backups\BANCO.FBK"
                    value={state.restore.fbk}
                    onChange={(e) => setState(prev => ({ ...prev, restore: { ...prev.restore, fbk: e.target.value } }))}
                    className="flex-1 w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Novo Banco (.FDB)</label>
                  <input 
                    type="text" 
                    placeholder="C:\Dados\BANCO_NOVO.FDB"
                    value={state.restore.dest}
                    onChange={(e) => setState(prev => ({ ...prev, restore: { ...prev.restore, dest: e.target.value } }))}
                    className="flex-1 w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>
            </OperationCard>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Repair Card */}
            <OperationCard 
              title="Recuperação" 
              icon={<Wrench className="w-5 h-5" />} 
              accentColor="amber"
              status={state.repair.state.status}
              onExecute={handleRepair}
              disabled={!state.repair.src || state.repair.state.status === 'running'}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Banco Corrompido (.FDB)</label>
                  <input 
                    type="text" 
                    placeholder="C:\Dados\BANCO_CORROMPIDO.FDB"
                    value={state.repair.src}
                    onChange={(e) => setState(prev => ({ ...prev, repair: { ...prev.repair, src: e.target.value } }))}
                    className="flex-1 w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-800 leading-relaxed">
                  <strong>Atenção:</strong> O processo de reparo (Validate & Mend) tenta corrigir erros estruturais mas pode resultar em perda de dados corrompidos. Sempre tente um backup antes.
                </div>
              </div>
            </OperationCard>
          </div>

          {/* Logs Section */}
          <div className="lg:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Console Backup
                  </span>
                </div>
                <LogBox logs={state.backup.state.logs} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Console Restore
                  </span>
                </div>
                <LogBox logs={state.restore.state.logs} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Console Repair
                  </span>
                </div>
                <LogBox logs={state.repair.state.logs} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-zinc-200 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Database className="w-4 h-4" />
            <span>© 2024 SUPORTE ECALC — Gestão de Dados Firebird</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs font-semibold text-zinc-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
              Documentação <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#" className="text-xs font-semibold text-zinc-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
              Suporte Técnico <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface OperationCardProps {
  title: string;
  icon: React.ReactNode;
  accentColor: 'indigo' | 'emerald' | 'amber';
  status: OperationStatus;
  onExecute: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function OperationCard({ title, icon, accentColor, status, onExecute, disabled, children }: OperationCardProps) {
  const colors = {
    indigo: 'bg-indigo-600 shadow-indigo-100 text-white',
    emerald: 'bg-emerald-600 shadow-emerald-100 text-white',
    amber: 'bg-amber-500 shadow-amber-100 text-white'
  };

  const btnColors = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
    amber: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-full"
    >
      <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-lg", colors[accentColor])}>
            {icon}
          </div>
          <h2 className="font-bold text-zinc-800">{title}</h2>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <div className="p-6 flex-1">
        {children}
      </div>

      <div className="p-6 pt-0">
        <button 
          onClick={onExecute}
          disabled={disabled}
          className={cn(
            "w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed shadow-lg",
            btnColors[accentColor]
          )}
        >
          {status === 'running' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          Iniciar Execução
        </button>
      </div>
    </motion.section>
  );
}

function Loader2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

