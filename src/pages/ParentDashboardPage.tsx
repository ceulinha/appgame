import { useEffect, useState } from 'react';
import type { GameState, Task, TaskCategory, TaskFrequency, JarSplit, JarGoals } from '../types';
import { WEEKDAYS, weekdayLabel } from '../utils/schedule';
import { getLast7DaysReport } from '../utils/reports';
import type { SyncStatus } from '../hooks/useGameState';

interface ParentDashboardPageProps {
  state: GameState;
  profiles: GameState[];
  activeProfileId: string;
  onSwitchProfile: (profileId: string) => void;
  onAddProfile: (name: string, age: number) => void;
  isTaskDoneToday: (taskId: string) => boolean;
  onAddTask: (task: Omit<Task, 'id' | 'active'>) => void;
  onUpdateTask: (taskId: string, updates: Omit<Task, 'id' | 'active'>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateGoal: (goal: number) => void;
  onUpdateJarSplit: (split: JarSplit) => void;
  onUpdateJarGoals: (goals: JarGoals) => void;
  onResetAll: () => void;
  onBack: () => void;
  isFirebaseConfigured: boolean;
  userEmail: string | null;
  authBusy: boolean;
  authError: string | null;
  syncStatus: SyncStatus;
  onSignUp: (email: string, password: string) => Promise<boolean>;
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onLogOut: () => void;
}

const ICON_OPTIONS = ['🧹', '📚', '🚿', '🥗', '🐕', '🌱', '🧺', '🚲', '🎹', '✏️'];

interface TaskFormState {
  name: string;
  icon: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  daysOfWeek: number[];
  xp: number;
  coins: number;
  money: number;
}

const EMPTY_FORM: TaskFormState = {
  name: '',
  icon: ICON_OPTIONS[0],
  category: 'habito',
  frequency: 'diaria',
  daysOfWeek: [],
  xp: 20,
  coins: 30,
  money: 0,
};

export default function ParentDashboardPage({
  state,
  profiles,
  activeProfileId,
  onSwitchProfile,
  onAddProfile,
  isTaskDoneToday,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateGoal,
  onUpdateJarSplit,
  onUpdateJarGoals,
  onResetAll,
  onBack,
  isFirebaseConfigured,
  userEmail,
  authBusy,
  authError,
  syncStatus,
  onSignUp,
  onSignIn,
  onLogOut,
}: ParentDashboardPageProps) {
  const { child, tasks, completions } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TaskFormState>(EMPTY_FORM);
  const [goalInput, setGoalInput] = useState(String(child.monthlyGoal));
  const [splitInput, setSplitInput] = useState<JarSplit>(child.jarSplit);
  const [jarGoalsInput, setJarGoalsInput] = useState<JarGoals>(child.jarGoals);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(8);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const splitTotal = splitInput.gastar + splitInput.guardar + splitInput.compartilhar;
  const weekReport = getLast7DaysReport(completions);
  const maxDayCount = Math.max(1, ...weekReport.map((d) => d.count));

  // Ao trocar de perfil, sincroniza os campos de formulário com os dados da criança ativa.
  useEffect(() => {
    setGoalInput(String(child.monthlyGoal));
    setSplitInput(child.jarSplit);
    setJarGoalsInput(child.jarGoals);
    setShowForm(false);
    setEditingId(null);
  }, [child.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const pendingTasks = tasks.filter((t) => t.active && !isTaskDoneToday(t.id));
  const doneTasks = tasks.filter((t) => t.active && isTaskDoneToday(t.id));
  const goalPercent = Math.min(100, Math.round((child.moneyEarned / child.monthlyGoal) * 100));
  const recentHistory = [...completions].reverse().slice(0, 8);

  const openNewTaskForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditTaskForm = (task: Task) => {
    setEditingId(task.id);
    setForm({
      name: task.name,
      icon: task.icon,
      category: task.category,
      frequency: task.frequency,
      daysOfWeek: task.daysOfWeek ?? [],
      xp: task.xp,
      coins: task.coins,
      money: task.money,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const toggleDay = (day: number) => {
    setForm((f) => ({
      ...f,
      daysOfWeek: f.daysOfWeek.includes(day)
        ? f.daysOfWeek.filter((d) => d !== day)
        : [...f.daysOfWeek, day].sort(),
    }));
  };

  const submitTask = () => {
    if (!form.name.trim()) return;
    const payload: Omit<Task, 'id' | 'active'> = {
      name: form.name.trim(),
      icon: form.icon,
      category: form.category,
      frequency: form.frequency,
      daysOfWeek: form.frequency === 'dias_especificos' ? form.daysOfWeek : undefined,
      xp: form.xp,
      coins: form.coins,
      money: form.money,
    };

    if (editingId) {
      onUpdateTask(editingId, payload);
    } else {
      onAddTask(payload);
    }
    closeForm();
  };

  const handleDelete = (task: Task) => {
    if (confirm(`Excluir a tarefa "${task.name}"? Essa ação não pode ser desfeita.`)) {
      onDeleteTask(task.id);
      if (editingId === task.id) closeForm();
    }
  };

  const handleAuthSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    if (authMode === 'signup') {
      await onSignUp(email.trim(), password);
    } else {
      await onSignIn(email.trim(), password);
    }
  };

  const SYNC_STATUS_LABEL: Record<SyncStatus, string> = {
    offline: 'Sem sincronização',
    syncing: 'Sincronizando...',
    synced: 'Sincronizado',
    error: 'Erro ao sincronizar',
  };
  const SYNC_STATUS_COLOR: Record<SyncStatus, string> = {
    offline: 'text-ink/40',
    syncing: 'text-gold',
    synced: 'text-mint',
    error: 'text-coral',
  };

  return (
    <div className="min-h-screen bg-cloud-warm pb-16">
      <div className="flex items-center justify-between bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-ink/40">Área dos pais</p>
          <h1 className="font-display text-xl font-extrabold text-ink">Painel de {child.name}</h1>
        </div>
        <button
          onClick={onBack}
          className="rounded-xl bg-ink/5 px-3 py-2 text-sm font-bold text-ink active:scale-95"
        >
          Voltar
        </button>
      </div>

      <div className="px-5 pt-5">
        {/* Sincronização na nuvem */}
        <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-display font-bold text-ink">☁️ Sincronizar entre aparelhos</p>
            {userEmail && (
              <span className={`text-xs font-bold ${SYNC_STATUS_COLOR[syncStatus]}`}>
                {SYNC_STATUS_LABEL[syncStatus]}
              </span>
            )}
          </div>

          {!isFirebaseConfigured ? (
            <p className="mt-2 text-xs text-ink/50">
              Ainda não configurado. Veja o README ("Como configurar o Firebase") para ativar a sincronização gratuita entre aparelhos.
            </p>
          ) : userEmail ? (
            <div className="mt-3">
              <p className="text-sm text-ink/60">
                Conectado como <span className="font-bold text-ink">{userEmail}</span>
              </p>
              <p className="mt-1 text-xs text-ink/40">
                Entre com essa mesma conta em outro aparelho (o da criança, por exemplo) para ver os mesmos dados.
              </p>
              <button
                onClick={onLogOut}
                className="mt-3 w-full rounded-xl border-2 border-ink/10 py-2 font-display text-sm font-bold text-ink/60 active:scale-95"
              >
                Sair da conta
              </button>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-2.5">
              <p className="text-xs text-ink/50">
                Crie uma conta gratuita (ou entre na sua) para manter os dados da família sincronizados em mais de um aparelho.
              </p>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-ink/10 px-3 py-2 text-sm outline-none focus:border-violet"
              />
              <input
                type="password"
                placeholder="Senha (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-ink/10 px-3 py-2 text-sm outline-none focus:border-violet"
              />
              {authError && <p className="text-xs font-bold text-coral">{authError}</p>}
              <button
                onClick={handleAuthSubmit}
                disabled={authBusy || !email.trim() || !password.trim()}
                className="rounded-lg bg-violet py-2 font-display text-sm font-bold text-white active:scale-95 disabled:opacity-40"
              >
                {authBusy ? 'Aguarde...' : authMode === 'signup' ? 'Criar conta' : 'Entrar'}
              </button>
              <button
                onClick={() => setAuthMode((m) => (m === 'signup' ? 'signin' : 'signup'))}
                className="text-xs font-bold text-violet"
              >
                {authMode === 'signup' ? 'Já tenho conta — entrar' : 'Não tenho conta — criar uma'}
              </button>
            </div>
          )}
        </div>

        {/* Seletor de perfil */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {profiles.map((p) => (
            <button
              key={p.child.id}
              onClick={() => onSwitchProfile(p.child.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-bold transition-all active:scale-95 ${
                p.child.id === activeProfileId ? 'bg-violet text-white' : 'bg-white text-ink/60 shadow-sm'
              }`}
            >
              <span>🧒</span>
              {p.child.name}
            </button>
          ))}
          <button
            onClick={() => setShowAddChild((v) => !v)}
            className="shrink-0 rounded-full bg-white px-3.5 py-2 text-sm font-bold text-violet shadow-sm active:scale-95"
          >
            + Criança
          </button>
        </div>

        {showAddChild && (
          <div className="mb-5 flex flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-sm">
            <p className="font-display font-bold text-ink">Adicionar nova criança</p>
            <input
              placeholder="Nome"
              value={newChildName}
              onChange={(e) => setNewChildName(e.target.value)}
              className="rounded-lg border border-ink/10 px-3 py-2 text-sm outline-none focus:border-violet"
            />
            <label className="text-xs font-bold text-ink/50">
              Idade
              <input
                type="number"
                value={newChildAge}
                onChange={(e) => setNewChildAge(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-ink/10 px-3 py-2 text-sm"
              />
            </label>
            <button
              onClick={() => {
                if (!newChildName.trim()) return;
                onAddProfile(newChildName.trim(), newChildAge);
                setNewChildName('');
                setNewChildAge(8);
                setShowAddChild(false);
              }}
              disabled={!newChildName.trim()}
              className="rounded-lg bg-coral py-2 font-display font-bold text-white active:scale-95 disabled:opacity-40"
            >
              Criar perfil
            </button>
            <p className="text-[11px] text-ink/40">
              O novo perfil começa do zero (nível 1, sem moedas) e usa as mesmas missões padrão — depois você pode ajustar cada uma.
            </p>
          </div>
        )}

        {/* Resumo */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-ink/40">Nível atual</p>
            <p className="font-display text-2xl font-extrabold text-violet">{child.level}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-ink/40">Mesada acumulada</p>
            <p className="font-display text-2xl font-extrabold text-mint">
              R$ {child.moneyEarned.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-ink/40">Tarefas concluídas hoje</p>
            <p className="font-display text-2xl font-extrabold text-ink">{doneTasks.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-ink/40">Tarefas pendentes</p>
            <p className="font-display text-2xl font-extrabold text-ink">{pendingTasks.length}</p>
          </div>
        </div>

        {/* Meta de mesada */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-display font-bold text-ink">Meta mensal</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-bold text-ink/50">R$</span>
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onBlur={() => onUpdateGoal(Number(goalInput) || child.monthlyGoal)}
              className="w-24 rounded-lg border border-ink/10 px-2 py-1 font-display font-bold text-ink outline-none focus:border-violet"
            />
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-mint to-mint-light transition-[width] duration-500"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs font-bold text-ink/50">{goalPercent}%</p>
        </div>

        {/* Potes: gastar / guardar / compartilhar */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-display font-bold text-ink">Divisão do dinheiro nos potes</p>
          <p className="mt-0.5 text-xs text-ink/50">
            Toda vez que {child.name} ganha dinheiro numa missão, ele é dividido automaticamente entre os três potes, nessa proporção.
          </p>

          <div className="mt-3 flex flex-col gap-2.5">
            {(['gastar', 'guardar', 'compartilhar'] as const).map((jar) => (
              <div key={jar} className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold capitalize text-ink/70">
                  {jar === 'gastar' ? '🛒 Gastar' : jar === 'guardar' ? '🐷 Guardar' : '🎁 Compartilhar'}
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={splitInput[jar]}
                    onChange={(e) => setSplitInput((s) => ({ ...s, [jar]: Number(e.target.value) }))}
                    className="w-16 rounded-lg border border-ink/10 px-2 py-1 text-right text-sm font-bold"
                  />
                  <span className="text-sm font-bold text-ink/40">%</span>
                </div>
              </div>
            ))}
          </div>

          <p className={`mt-2 text-xs font-bold ${splitTotal === 100 ? 'text-mint' : 'text-coral'}`}>
            Total: {splitTotal}% {splitTotal !== 100 && '(precisa somar 100%)'}
          </p>

          <button
            onClick={() => splitTotal === 100 && onUpdateJarSplit(splitInput)}
            disabled={splitTotal !== 100}
            className="mt-3 w-full rounded-xl bg-violet py-2 font-display text-sm font-bold text-white active:scale-95 disabled:opacity-40"
          >
            Salvar divisão
          </button>

          <p className="mb-1.5 mt-5 font-display text-sm font-bold text-ink">Metas de cada pote (opcional)</p>
          <div className="flex flex-col gap-2.5">
            {(['gastar', 'guardar', 'compartilhar'] as const).map((jar) => (
              <div key={jar} className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold capitalize text-ink/70">
                  {jar === 'gastar' ? '🛒 Gastar' : jar === 'guardar' ? '🐷 Guardar' : '🎁 Compartilhar'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-ink/40">R$</span>
                  <input
                    type="number"
                    value={jarGoalsInput[jar]}
                    onChange={(e) => setJarGoalsInput((g) => ({ ...g, [jar]: Number(e.target.value) }))}
                    className="w-20 rounded-lg border border-ink/10 px-2 py-1 text-right text-sm font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onUpdateJarGoals(jarGoalsInput)}
            className="mt-3 w-full rounded-xl bg-violet/10 py-2 font-display text-sm font-bold text-violet active:scale-95"
          >
            Salvar metas dos potes
          </button>
        </div>

        {/* Relatório da semana */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-display font-bold text-ink">Missões concluídas nos últimos 7 dias</p>
          <div className="mt-4 flex items-end justify-between gap-2" style={{ height: 90 }}>
            {weekReport.map((day) => (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-violet to-violet-light transition-[height] duration-500"
                    style={{ height: `${Math.max(4, (day.count / maxDayCount) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-ink/40">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de tarefas */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display font-bold text-ink">Tarefas cadastradas</p>
            <button
              onClick={() => (showForm ? closeForm() : openNewTaskForm())}
              className="rounded-lg bg-violet px-3 py-1.5 text-xs font-bold text-white active:scale-95"
            >
              {showForm ? 'Cancelar' : '+ Nova tarefa'}
            </button>
          </div>

          {showForm && (
            <div className="mb-4 flex flex-col gap-3 rounded-xl bg-cloud p-3">
              <p className="text-xs font-bold text-ink/40">
                {editingId ? 'Editando tarefa' : 'Nova tarefa'}
              </p>
              <input
                placeholder="Nome da tarefa"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-lg border border-ink/10 px-3 py-2 text-sm outline-none focus:border-violet"
              />

              <div className="flex gap-1.5 overflow-x-auto">
                {ICON_OPTIONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                    className={`h-9 w-9 shrink-0 rounded-lg text-lg ${form.icon === ic ? 'bg-violet/20 ring-2 ring-violet' : 'bg-white'}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as TaskCategory }))}
                  className="flex-1 rounded-lg border border-ink/10 px-2 py-2 text-sm"
                >
                  <option value="habito">Hábito</option>
                  <option value="responsabilidade">Responsabilidade</option>
                  <option value="missao_especial">Missão especial</option>
                </select>
                <select
                  value={form.frequency}
                  onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value as TaskFrequency }))}
                  className="flex-1 rounded-lg border border-ink/10 px-2 py-2 text-sm"
                >
                  <option value="diaria">Diária</option>
                  <option value="semanal">Semanal</option>
                  <option value="dias_especificos">Dias específicos</option>
                </select>
              </div>

              {form.frequency === 'dias_especificos' && (
                <div>
                  <p className="mb-1.5 text-xs font-bold text-ink/50">Em quais dias?</p>
                  <div className="flex gap-1.5">
                    {WEEKDAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`h-9 w-9 rounded-lg text-xs font-bold transition-all ${
                          form.daysOfWeek.includes(day) ? 'bg-violet text-white' : 'bg-white text-ink/50'
                        }`}
                      >
                        {weekdayLabel(day)}
                      </button>
                    ))}
                  </div>
                  {form.daysOfWeek.length === 0 && (
                    <p className="mt-1 text-[11px] font-bold text-coral">Selecione ao menos um dia.</p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <label className="flex-1 text-xs font-bold text-ink/50">
                  XP
                  <input
                    type="number"
                    value={form.xp}
                    onChange={(e) => setForm((f) => ({ ...f, xp: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-lg border border-ink/10 px-2 py-1.5 text-sm"
                  />
                </label>
                <label className="flex-1 text-xs font-bold text-ink/50">
                  Moedas
                  <input
                    type="number"
                    value={form.coins}
                    onChange={(e) => setForm((f) => ({ ...f, coins: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-lg border border-ink/10 px-2 py-1.5 text-sm"
                  />
                </label>
                <label className="flex-1 text-xs font-bold text-ink/50">
                  R$
                  <input
                    type="number"
                    step="0.5"
                    value={form.money}
                    onChange={(e) => setForm((f) => ({ ...f, money: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-lg border border-ink/10 px-2 py-1.5 text-sm"
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={submitTask}
                  disabled={form.frequency === 'dias_especificos' && form.daysOfWeek.length === 0}
                  className="flex-1 rounded-lg bg-coral py-2 font-display font-bold text-white active:scale-95 disabled:opacity-40"
                >
                  {editingId ? 'Salvar alterações' : 'Salvar tarefa'}
                </button>
                {editingId && (
                  <button
                    onClick={() => {
                      const task = tasks.find((t) => t.id === editingId);
                      if (task) handleDelete(task);
                    }}
                    className="rounded-lg border-2 border-red-200 px-4 py-2 font-display text-sm font-bold text-red-500 active:scale-95"
                  >
                    Excluir
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {tasks.filter((t) => t.active).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl bg-cloud px-3 py-2">
                <button
                  onClick={() => openEditTaskForm(t)}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  <span>{t.icon}</span>
                  <span className="text-sm font-bold text-ink">{t.name}</span>
                  <span className={`text-xs font-bold ${isTaskDoneToday(t.id) ? 'text-mint' : 'text-ink/40'}`}>
                    {isTaskDoneToday(t.id) ? '· Concluída' : '· Pendente'}
                  </span>
                </button>
                <button
                  onClick={() => handleDelete(t)}
                  className="ml-2 shrink-0 rounded-lg px-2 py-1 text-xs font-bold text-red-400 active:scale-90"
                  aria-label={`Excluir ${t.name}`}
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-2 font-display font-bold text-ink">Histórico recente</p>
          {recentHistory.length === 0 ? (
            <p className="text-sm text-ink/40">Nenhuma tarefa concluída ainda.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {recentHistory.map((h) => {
                const task = tasks.find((t) => t.id === h.taskId);
                return (
                  <div key={h.id} className="flex items-center justify-between text-sm">
                    <span className="text-ink/70">{task?.icon} {task?.name ?? 'Tarefa removida'}</span>
                    <span className="text-xs text-ink/40">
                      {new Date(h.completedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            if (confirm('Isso vai apagar todo o progresso salvo. Deseja continuar?')) onResetAll();
          }}
          className="mt-6 w-full rounded-2xl border-2 border-red-200 py-3 font-display text-sm font-bold text-red-500 active:scale-95"
        >
          Resetar dados (apenas para testes)
        </button>
      </div>
    </div>
  );
}
