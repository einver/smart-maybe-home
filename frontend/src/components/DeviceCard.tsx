import React from "react";
import TemperatureChart from "./TemperatureChart";

import {
  parseDeviceState,
  isLampState,
  isSensorState,
  isACState,
  isMotorState,
  isHeaterState
} from "../utils/deviceState";

import { DeviceType } from "../shared/deviceTypes";

import {
  WifiIcon,
  FireIcon,
  SunIcon
} from "@heroicons/react/24/outline";

type ConnectionType =
  | "Virtual"
  | "MQTT"
  | "Zigbee";

type Device = {
  id: string;
  name: string;
  type: DeviceType;
  roomId: string;
  stateJson: string;

  connectionType: ConnectionType;

  mqttTopic?: string;
  externalId?: string;
};

type Room = {
  id: string;
  name: string;
};

type Props = {
  device: Device;
  rooms: Room[];

  sliderValues: Record<string, number>;

  setSliderValues: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;

  updateState: (
    device: Device,
    newState: any
  ) => Promise<void>;

  toggleDevice: (device: Device) => Promise<void>;

  deleteDevice: (id: string) => Promise<void>;
};

function DeviceCard({
  device: d,
  rooms,
  sliderValues,
  setSliderValues,
  updateState,
  toggleDevice,
  deleteDevice
}: Props) {
  const state = parseDeviceState(
    d.type,
    d.stateJson
  );

  const powered =
    state &&
    typeof state === "object" &&
    "power" in state &&
    state.power;
    

  const getRoomName = (roomId: string) =>
    rooms.find(r => r.id === roomId)?.name ||
    "Unknown";

  return (
    <div
      className={` glass-card
            relative
            flex
            h-[600px]
            flex-col
            overflow-hidden
            rounded-[30px]
            p-6 ${
        powered
          ? "ring-2 ring-indigo-200"
          : ""
      }`}
    >
      <div className="absolute right-[-50px] top-[-50px] h-36 w-36 rounded-full bg-gradient-to-br from-indigo-400/20 to-cyan-300/10 blur-3xl" />

      {/* TOP */}

      <div className="relative z-10 mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            {d.name}
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="badge badge-primary">
              {d.type}
            </span>

            <span className="badge bg-slate-100 text-slate-600">
              {getRoomName(d.roomId)}
            </span>

            <span
              className={`badge ${
                d.connectionType === "Virtual"
                  ? "bg-violet-100 text-violet-600"
                  : d.connectionType === "MQTT"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {d.connectionType}
            </span>
          </div>
        </div>

        <button
          onClick={() => deleteDevice(d.id)}
          className="rounded-2xl bg-red-50 px-4 py-3 font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
        >
          ✕
        </button>
      </div>

      {!state && (
        <div className="rounded-2xl bg-red-100 p-4 text-red-500">
          Invalid JSON state
        </div>
      )}

      {/* LAMP */}

      {isLampState(d.type, state) && (
        <div className="space-y-5 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-yellow-100 p-3 text-yellow-600">
                <SunIcon className="h-6 w-6" />
              </div>

              <div>
                <div className="font-semibold text-slate-700">
                  Статус
                </div>

                <div className="text-sm text-slate-500">
                  Умная система освещения
                </div>
              </div>
            </div>

            <span
              className={`badge ${
                state.power
                  ? "badge-success"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {state.power ? "Вкл." : "Выкл."}
            </span>
          </div>

          <button
            onClick={() => toggleDevice(d)}
            className={`w-full rounded-2xl py-4 text-lg font-bold transition ${
              state.power
                ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-200"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Переключить
          </button>

          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium text-slate-600">
                Яркость
              </span>

              <span className="text-xl font-black text-indigo-600">
                {state.brightness ?? 100}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={state.brightness ?? 100}
              onChange={e =>
                updateState(d, {
                  ...state,
                  brightness: Number(e.target.value)
                })
              }
              className="slider"
            />
          </div>
        </div>
      )}

      {/* AC */}

      {isACState(d.type, state) && (
        <div className="space-y-5 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-700">
                Кондиционер
              </div>

              <div className="text-sm text-slate-500">
                Климат контроль
              </div>
            </div>

            <span
              className={`badge ${
                state.power
                  ? "badge-primary"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {state.power ? "Вкл." : "Выкл."}
            </span>
          </div>

          <button
            onClick={() => toggleDevice(d)}
            className="btn-primary w-full"
          >
            Переключить
          </button>

          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium text-slate-600">
                Температура
              </span>

              <span className="text-3xl font-black text-indigo-600">
                {state.targetTemp ?? 22}°
              </span>
            </div>

            <input
              type="range"
              min="16"
              max="32"
              value={state.targetTemp ?? 22}
              onChange={e =>
                updateState(d, {
                  ...state,
                  targetTemp: Number(e.target.value)
                })
              }
              className="slider"
            />
          </div>
        </div>
      )}

      {/* HEATER */}

      {isHeaterState(d.type, state) && (
        <div className="space-y-5 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-500">
                <FireIcon className="h-6 w-6" />
              </div>

              <div>
                <div className="font-semibold text-slate-700">
                  Нагреватель
                </div>

                <div className="text-sm text-slate-500">
                  Умная система нагрева
                </div>
              </div>
            </div>

            <span
              className={`badge ${
                state.power
                  ? "bg-orange-100 text-orange-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {state.power ? "Вкл." : "Выкл."}
            </span>
          </div>

          <button
            onClick={() => toggleDevice(d)}
            className="w-full rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 py-4 font-bold text-white"
          >
            Переключить
          </button>
        </div>
      )}

      {/* MOTOR */}

      {isMotorState(d.type, state) && (
        <div className="space-y-5 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-700">
                Положение окна
              </div>

              <div className="text-sm text-slate-500">
                Система открытия окон
              </div>
            </div>

            <div className="text-3xl font-black text-indigo-600">
              {state.position ?? 0}%
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <input
              type="range"
              min="0"
              max="100"
              className="slider"
              value={
                sliderValues[d.id] ??
                state.position ??
                0
              }
              onChange={e =>
                setSliderValues(prev => ({
                  ...prev,
                  [d.id]: Number(e.target.value)
                }))
              }
              onMouseUp={() =>
                updateState(d, {
                  position:
                    sliderValues[d.id] ??
                    state.position ??
                    0
                })
              }
            />
          </div>
        </div>
      )}

      {/* SENSOR */}

      {isSensorState(d.type, state) && (
        <div className="space-y-5 overflow-y-auto pr-1">
          {state.temperature !== undefined && (
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-700">
                    Температура
                  </div>

                  <div className="text-sm text-slate-500">
                    Данные в реальном времени
                  </div>
                </div>

                <span className="text-4xl font-black text-indigo-600">
                  {state.temperature}°
                </span>
              </div>

              <div className="h-[220px]">
                <TemperatureChart deviceId={d.id} />
              </div>
            </div>
          )}

          {state.motion !== undefined && (
            <div
              className={`rounded-3xl p-5 text-center text-lg font-bold ${
                state.motion
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {state.motion
                ? "🟢 Зафиксировано движение"
                : "🛑 Движений нет"}
            </div>
          )}

          {state.occupancy !== undefined && (
            <div
              className={`rounded-3xl p-5 text-center text-lg font-bold ${
                state.occupancy
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {state.occupancy
                ? "🟢 Зафиксировано движение"
                : "🛑 Движений нет"}
            </div>
          )}

          {state.illuminance !== undefined && (
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="text-sm text-slate-500">
                Освещённость
              </div>

              <div className="mt-2 text-4xl font-black text-amber-500">
                {state.illuminance}
              </div>

              <div className="text-sm text-slate-400">
                lux
              </div>
            </div>
          )}
          {state.battery !== undefined && (
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="text-sm text-slate-500">
                Заряд батареи
              </div>

              <div className="mt-2 text-4xl font-black text-green-600">
                {state.battery}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* MQTT */}

      {(
        d.connectionType === "MQTT" ||
        d.connectionType === "Zigbee"
      ) &&
      d.mqttTopic && (
        <div className="mt-auto pt-6">
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <WifiIcon className="h-4 w-4" />
              MQTT Topic
            </div>

            <div className="break-all rounded-2xl bg-slate-50 p-4 font-mono text-sm text-indigo-600">
              {d.mqttTopic}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(DeviceCard);