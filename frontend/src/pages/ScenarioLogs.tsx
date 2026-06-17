import { useEffect, useState } from "react";
import api from "../api/api";

type ScenarioLog = {
  id: string;
  executedAt: string;
  triggerType: string;
  details: string;

  scenario?: {
    name: string;
  };
};

type DeviceLog = {
  id: string;
  createdAt: string;
  eventType: string;
  details: string;

  device?: {
    name: string;
  };
};

export default function ScenarioLogs() {
  const [scenarioLogs, setScenarioLogs] =
    useState<ScenarioLog[]>([]);

  const [deviceLogs, setDeviceLogs] =
    useState<DeviceLog[]>([]);

  const loadData = async () => {
    try {
      const [scenarioRes, deviceRes] =
        await Promise.all([
          api.get("/scenarioLogs"),
          api.get("/deviceLogs")
        ]);

      setScenarioLogs(scenarioRes.data);
      setDeviceLogs(deviceRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-800">
          Системный журнал
        </h1>

        <p className="mt-2 text-slate-500">
          История устройств и сценариев
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Устройства */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">
            📡 События устройств
          </h2>

          <div className="max-h-[700px] space-y-3 overflow-y-auto pr-2">
            {deviceLogs.length === 0 && (
              <p className="text-slate-400">
                Нет событий устройств
              </p>
            )}

            {deviceLogs.map(log => (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="font-semibold">
                  {log.device?.name ?? "Устройство"}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  {log.eventType}
                </div>

                {log.details && (
                  <div className="mt-2 break-all rounded-lg bg-white p-2 font-mono text-xs">
                    {log.details}
                  </div>
                )}

                <div className="mt-3 text-xs text-slate-400">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Сценарии */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">
            ⚙ Выполнение сценариев
          </h2>

          <div className="max-h-[700px] space-y-3 overflow-y-auto pr-2">
            {scenarioLogs.length === 0 && (
              <p className="text-slate-400">
                Нет запусков сценариев
              </p>
            )}

            {scenarioLogs.map(log => (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="font-semibold">
                  {log.scenario?.name ??
                    "Неизвестный сценарий"}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  {log.triggerType}
                </div>

                {log.details && (
                  <div className="mt-2 break-all rounded-lg bg-white p-2 text-sm">
                    {log.details}
                  </div>
                )}

                <div className="mt-3 text-xs text-slate-400">
                  {new Date(log.executedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}