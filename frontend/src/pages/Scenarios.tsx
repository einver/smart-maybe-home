import { useEffect, useState } from "react";

import api from "../api/api";

import { useNavigate } from "react-router-dom";

import {
  BoltIcon,
  PlayIcon,
  TrashIcon,
  EyeIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

type Scenario = {
  id: string;
  name: string;
  isActive: boolean;
};

export default function Scenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const [name, setName] = useState("");

  const navigate = useNavigate();

  const loadScenarios = async () => {
    const res = await api.get("/scenarios");

    setScenarios(res.data);
  };

  useEffect(() => {
    loadScenarios();
  }, []);

  const createScenario = async () => {
    if (!name) return;

    await api.post("/scenarios", { name });

    setName("");

    loadScenarios();
  };

  const deleteScenario = async (id: string) => {
    await api.delete(`/scenarios/${id}`);

    loadScenarios();
  };

  const toggleScenario = async (s: Scenario) => {
    await api.put(`/scenarios/${s.id}/toggle`);

    loadScenarios();
  };

  const activeCount = scenarios.filter(s => s.isActive).length;

  return (
    <div className="space-y-8 fade-in">
      {/* HERO */}
      <div
        className="
          glass-card relative overflow-hidden
          rounded-[32px]
          p-6 md:p-8
        "
      >
        {/* BG */}
        <div
          className="
            absolute right-0 top-0
            h-56 w-56
            rounded-full
            bg-indigo-500/10
            blur-3xl
          "
        />

        <div
          className="
            absolute bottom-0 left-0
            h-44 w-44
            rounded-full
            bg-cyan-400/10
            blur-3xl
          "
        />

        <div
          className="
            relative z-10
            flex flex-col gap-8
            xl:flex-row xl:items-center xl:justify-between
          "
        >
          {/* LEFT */}
          <div className="max-w-2xl">
            <div
              className="
                mb-5 inline-flex items-center gap-2
                rounded-full
                bg-indigo-500/10
                px-4 py-2
                text-sm font-semibold
                text-indigo-600
              "
            >
              <SparklesIcon className="h-4 w-4" />

              Ядро атоматизации
            </div>

            <h1
              className="
                text-4xl font-black tracking-tight
                text-slate-800
                md:text-5xl
              "
            >
              Сценарии
            </h1>

            <p
              className="
                mt-4 max-w-xl
                text-base leading-relaxed
                text-slate-500
                md:text-lg
              "
            >
              Создавайте автоматизированные рабочие процессы для ваших устройств и управляйте действиями в режиме реального времени.
            </p>

            {/* STATS */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="glass-card rounded-2xl px-5 py-4">
                <div className="text-sm text-slate-500">
                  Total Scenarios
                </div>

                <div className="mt-1 text-2xl font-black text-slate-800">
                  {scenarios.length}
                </div>
              </div>

              <div className="glass-card rounded-2xl px-5 py-4">
                <div className="text-sm text-slate-500">
                  Active
                </div>

                <div className="mt-1 text-2xl font-black text-emerald-500">
                  {activeCount}
                </div>
              </div>
            </div>
          </div>

          {/* CREATE */}
          <div
            className="
              glass-card
              w-full max-w-xl
              rounded-[28px]
              p-5 md:p-6
            "
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-indigo-500
                  to-cyan-400
                  text-white
                  shadow-lg shadow-indigo-500/20
                "
              >
                <BoltIcon className="h-6 w-6" />
              </div>

              <div>
                <div className="text-lg font-bold text-slate-800">
                  новый сценарий
                </div>

                <div className="text-sm text-slate-500">
                  Добавить процесс автоматизации
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Scenario name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="app-input"
              />

              <button
                onClick={createScenario}
                className="
                  btn-primary
                  w-full
                "
              >
                Создать сценарий
              </button>
              <button
                onClick={() =>
                  navigate("/Scenario-Templates")
                }
                className="
                  w-full
                  rounded-2xl
                  border border-indigo-200
                  bg-indigo-50
                  px-4 py-3
                  font-semibold
                  text-indigo-600
                  transition
                  hover:bg-indigo-100
                "
              >
                ✨ Создать по шаблону
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div
        className="
          grid grid-cols-1 gap-6
          2xl:grid-cols-2
        "
      >
        {scenarios.map(s => (
          <div
            key={s.id}
            className="
              glass-card float-card
              rounded-[30px]
              p-6
            "
          >
            {/* TOP */}
            <div
              className="
                flex flex-col gap-5
                lg:flex-row lg:items-start lg:justify-between
              "
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-14 w-14 items-center justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-indigo-500
                      to-cyan-400
                      text-white
                      shadow-lg shadow-indigo-500/20
                    "
                  >
                    <BoltIcon className="h-7 w-7" />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
                        truncate
                        text-2xl font-black
                        text-slate-800
                      "
                    >
                      {s.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Сценарий автоматизации
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <span
                  className={`
                    inline-flex items-center
                    rounded-full px-4 py-2
                    text-sm font-bold
                    ${
                      s.isActive
                        ? `
                          bg-emerald-500/15
                          text-emerald-600
                        `
                        : `
                          bg-rose-500/12
                          text-rose-500
                        `
                    }
                  `}
                >
                  {s.isActive ? "Вкл." : "Выкл."}
                </span>
              </div>
            </div>

            {/* INFO */}
            <div
              className="
                mt-6 rounded-3xl
                bg-slate-50/80
                p-5
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">
                    Состояние
                  </div>

                  <div className="mt-2 text-lg font-bold text-slate-800">
                    {s.isActive
                      ? "Автоматизация активна"
                      : "Автоматизация выключена"}
                  </div>
                </div>

                <div
                  className={`
                    h-4 w-4 rounded-full
                    ${
                      s.isActive
                        ? "bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.6)]"
                        : "bg-slate-300"
                    }
                  `}
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div
              className="
                mt-6 grid grid-cols-1 gap-3
                md:grid-cols-3
              "
            >
              <button
                onClick={() => toggleScenario(s)}
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl
                  border border-slate-200
                  bg-white/80
                  px-4 py-3
                  font-semibold text-slate-700
                  transition
                  hover:border-indigo-200
                  hover:bg-indigo-50
                "
              >
                <PlayIcon className="h-5 w-5" />

                Переключить
              </button>

              <button
                onClick={() =>
                  navigate(`/scenarios/${s.id}`)
                }
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-indigo-500
                  to-cyan-400
                  px-4 py-3
                  font-bold text-white
                  shadow-lg shadow-indigo-500/20
                "
              >
                <EyeIcon className="h-5 w-5" />

                Открыть
              </button>

              <button
                onClick={() => deleteScenario(s.id)}
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl
                  bg-rose-500
                  px-4 py-3
                  font-semibold text-white
                  transition
                  hover:bg-rose-600
                "
              >
                <TrashIcon className="h-5 w-5" />

                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {scenarios.length === 0 && (
        <div
          className="
            glass-card
            rounded-[30px]
            p-12 text-center
          "
        >
          <div
            className="
              mx-auto flex h-20 w-20 items-center justify-center
              rounded-3xl
              bg-indigo-500/10
              text-indigo-500
            "
          >
            <BoltIcon className="h-10 w-10" />
          </div>

          <h3 className="mt-6 text-2xl font-black text-slate-800">
            Пока что сценарие нет
          </h3>

          <p className="mt-3 text-slate-500">
            Создайте свой первый сценарий автоматизации для автоматического управления интеллектуальными устройствами.
          </p>
        </div>
      )}
    </div>
  );
}