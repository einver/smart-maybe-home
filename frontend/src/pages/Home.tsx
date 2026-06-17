import { useEffect, useState } from "react";
import api from "../api/api";
import {
  HomeIcon,
  CpuChipIcon,
  BoltIcon,
  ClockIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

type Room = {
  id: string;
  name: string;
};

type Device = {
  id: string;
  name: string;
};

type Scenario = {
  id: string;
  name: string;
  isActive: boolean;
};

type Log = {
  id: string;
  scenarioId: string;
  executedAt: string;
  details: string;
  scenario?: {
    name: string;
  };
};

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  const loadData = async () => {
    const [r, d, s, l] = await Promise.all([
      api.get("/rooms"),
      api.get("/devices"),
      api.get("/scenarios"),
      api.get("/ScenarioLogs")
    ]);

    setRooms(r.data);
    setDevices(d.data);
    setScenarios(s.data);
    setLogs(l.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeScenarios = scenarios.filter(s => s.isActive);

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-br from-cyan-100 via-white to-violet-100 p-8 shadow-[0_20px_80px_rgba(59,130,246,0.15)]">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/70 px-4 py-2 text-sm font-medium text-cyan-700 backdrop-blur">
              <SparklesIcon className="h-4 w-4" />
              Умная автоматизированая платформа
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-800 md:text-5xl">
              Умный дом дашборд
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Отслеживание, управление и автоматизация вашего умного дома, с использованием MQTT сценариев и датчиков
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-2">
            <MiniCard
              title="Комнаты"
              value={rooms.length}
            />

            <MiniCard
              title="Устройства"
              value={devices.length}
            />

            <MiniCard
              title="Сценарии"
              value={scenarios.length}
            />

            <MiniCard
              title="Логи"
              value={logs.length}
            />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Link to="/rooms">
          <StatCard
            title="Комнаты"
            value={rooms.length}
            icon={<HomeIcon className="h-7 w-7" />}
            description="Подключенные комнаты"
          />
        </Link>

        <Link to="/devices">
          <StatCard
            title="Устройства"
            value={devices.length}
            icon={<CpuChipIcon className="h-7 w-7" />}
            description="Подключенные устройства"
          />
        </Link>

        <Link to="/scenarios">
          <StatCard
            title="Активные сценарии"
            value={activeScenarios.length}
            icon={<BoltIcon className="h-7 w-7" />}
            description="Включенная автоматизация"
          />
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* ACTIVE SCENARIOS */}
        <div className="xl:col-span-2">
          <div className="h-full rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg">
                <BoltIcon className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Активные сценарии
                </h2>

                <p className="text-sm text-slate-500">
                  Текущая автоматизация
                </p>
              </div>
            </div>

            {activeScenarios.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                Нет активных сценариев
              </div>
            ) : (
              <div className="space-y-4">
                {activeScenarios.map(s => (
                  <div
                    key={s.id}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-800">
                          {s.name}
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          Автоматизация включена
                        </div>
                      </div>

                      <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600">
                        Активен
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="xl:col-span-3">
          <div className="h-full rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg">
                <ClockIcon className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Последняя активность
                </h2>

                <p className="text-sm text-slate-500">
                  Последние сработавшие сценарии
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {logs.slice(0, 5).map(l => {
                let details = "";

                try {
                  const parsed = JSON.parse(l.details || "{}");

                  details = Object.entries(parsed)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ");
                } catch {
                  details = l.details;
                }

                return (
                  <div
                    key={l.id}
                    className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-5 transition hover:border-cyan-300 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">
                          {l.scenario?.name || "Scenario"}
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          {details}
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                        {new Date(l.executedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}

              {logs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                  No activity yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-200/40 to-violet-200/40 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="text-sm font-medium text-slate-500">
              {title}
            </div>

            <div className="mt-3 text-5xl font-black tracking-tight text-slate-800">
              {value}
            </div>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white shadow-lg">
            {icon}
          </div>
        </div>

        <div className="text-sm text-slate-500">
          {description}
        </div>
      </div>
    </div>
  );
}

function MiniCard({
  title,
  value
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/70 p-4 backdrop-blur">
      <div className="text-sm font-medium text-slate-500">
        {title}
      </div>

      <div className="mt-2 text-3xl font-black text-slate-800">
        {value}
      </div>
    </div>
  );
}