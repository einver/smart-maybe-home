import { useEffect, useState } from "react";
import api from "../api/api";

import { scenarioTemplates } from "../data/scenarioTemplates";

import {
  SparklesIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

type Room = {
  id: string;
  name: string;
};

type Device = {
  id: string;
  name: string;
  type: string;
  roomId: string;
  stateJson: string;
};

function normalizeParameter(
  parameter: string
) {
  if (parameter === "motion")
    return "occupancy";

  return parameter;
}

function resolveParameter(
  parameter: string,
  device: Device
) {
  try {
    const state = JSON.parse(
      device.stateJson ?? "{}"
    );

    if (
      parameter === "motion" &&
      "occupancy" in state
    ) {
      return "occupancy";
    }

    return parameter;
  } catch {
    return parameter;
  }
}

export default function ScenarioTemplates() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [roomId, setRoomId] = useState("");
  // const aliases: Record<string, string[]> = {
  //   motion: ["motion", "occupancy"]
  // };

  useEffect(() => {
    loadData();
  }, []);
  function findDeviceForParameter(
    devices: Device[],
    deviceType: string,
    parameter: string
  ) {
    return devices.find(device => {
      if (device.type !== deviceType)
        return false;

      try {
        const state = JSON.parse(
          device.stateJson ?? "{}"
        );

        const realParameter =
          normalizeParameter(parameter);

        return realParameter in state;
      } catch {
        return false;
      }
    });
  }

  const loadData = async () => {
    const roomRes = await api.get("/rooms");
    const deviceRes = await api.get("/devices");

    setRooms(roomRes.data);
    setDevices(deviceRes.data);
  };

  const createTemplateScenario = async (
    template: any
  ) => {
    if (!roomId) {
      alert("Выберите комнату");
      return;
    }

    const roomDevices = devices.filter(
      d => d.roomId === roomId
    );

    const room = rooms.find(
      r => r.id === roomId
    );

    const scenarioName =
      room?.name
        ? `${room.name} • ${template.name}`
        : template.name;

    const created = await api.post(
      "/scenarios",
      {
        name: scenarioName
      }
    );

    const scenarioId = created.data.id;

    const missing: string[] = [];

    for (const condition of template.conditions) {
      const device =
        findDeviceForParameter(
          roomDevices,
          condition.deviceType,
          condition.parameter
        );

      if (!device) {
        missing.push(condition.deviceType);
        continue;
      }

      try {
        const realParameter =
        resolveParameter(
          condition.parameter,
          device
        );

        console.log(
          "Template parameter:",
          condition.parameter
        );

        console.log(
          "Device:",
          device.name
        );

        console.log(
          "State:",
          device.stateJson
        );

        console.log(
          "Real parameter:",
          realParameter
        );

      await api.post("/conditions", {
        scenarioId,
        deviceId: device.id,
        parameter: realParameter,
        operator: condition.operator,
        value: String(condition.value),
        logicalOperator: "AND"
      });
      } catch (err: any) {
        console.error(
          "Condition error:",
          err.response?.data
        );
      }
    }

    for (const action of template.actions) {
      const device =
        findDeviceForParameter(
          roomDevices,
          action.deviceType,
          action.field
        );

      if (!device) {
        missing.push(action.deviceType);
        continue;
      }

      try {
        await api.post("/actions", {
          scenarioId,
          deviceId: device.id,
          actionType: "SET_STATE",
          value: JSON.stringify({
            [action.field]: action.value
          })
        });
      } catch (err: any) {
        console.error(
          "Action error:",
          err.response?.data
        );
      }
    }

    if (missing.length) {
      alert(
        `Сценарий создан.\n\nНе найдены устройства:\n${[
          ...new Set(missing)
        ].join("\n")}`
      );
    } else {
      alert("Сценарий успешно создан");
    }
  };

  return (
    <div className="space-y-8 fade-in">
      {/* HEADER */}

      <div className="glass-card rounded-[32px] p-8">
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-14 w-14 items-center justify-center
              rounded-2xl
              bg-gradient-to-br
              from-indigo-500
              to-cyan-400
              text-white
            "
          >
            <SparklesIcon className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-4xl font-black text-slate-800">
              Шаблоны сценариев
            </h1>

            <p className="mt-2 text-slate-500">
              Быстрое создание автоматизации
            </p>
          </div>
        </div>

        <div className="mt-8">
          <label className="mb-2 block text-sm font-semibold text-slate-600">
            Комната
          </label>

          <select
            value={roomId}
            onChange={e =>
              setRoomId(e.target.value)
            }
            className="app-input"
          >
            <option value="">
              Выберите комнату
            </option>

            {rooms.map(room => (
              <option
                key={room.id}
                value={room.id}
              >
                {room.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TEMPLATES */}

      <div className="grid gap-6 xl:grid-cols-2">
        {scenarioTemplates.map(template => {
          const roomDevices =
            devices.filter(
              d => d.roomId === roomId
            );

          const missing =
            template.requiredDevices.filter(
              (type: string) =>
                !roomDevices.some(
                  d => d.type === type
                )
            );

          return (
            <div
              key={template.id}
              className="
                glass-card
                rounded-[30px]
                p-6
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-5xl">
                    {template.icon}
                  </div>

                  <h3
                    className="
                      mt-4
                      text-2xl
                      font-black
                      text-slate-800
                    "
                  >
                    {template.name}
                  </h3>

                  <p className="mt-2 text-slate-500">
                    {template.description}
                  </p>
                </div>

                <HomeIcon className="h-8 w-8 text-indigo-500" />
              </div>

              {/* REQUIRED DEVICES */}

              <div className="mt-6">
                <div
                  className="
                    text-sm
                    font-semibold
                    text-slate-500
                  "
                >
                  Требуемые устройства
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {template.requiredDevices.map(
                    (device: string) => (
                      <span
                        key={device}
                        className="
                          rounded-full
                          bg-slate-100
                          px-3 py-2
                          text-sm
                        "
                      >
                        {device}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* STATUS */}

              {roomId && (
                <div className="mt-6">
                  {missing.length === 0 ? (
                    <div
                      className="
                        flex items-center gap-2
                        rounded-2xl
                        bg-emerald-50
                        p-4
                        text-emerald-600
                      "
                    >
                      <CheckCircleIcon className="h-5 w-5" />

                      Все устройства найдены
                    </div>
                  ) : (
                    <div
                      className="
                        rounded-2xl
                        bg-amber-50
                        p-4
                      "
                    >
                      <div
                        className="
                          flex items-center gap-2
                          font-semibold
                          text-amber-700
                        "
                      >
                        <ExclamationTriangleIcon className="h-5 w-5" />

                        Отсутствуют устройства
                      </div>

                      <ul className="mt-3 space-y-1 text-sm text-amber-700">
                        {missing.map(
                          (m: string) => (
                            <li key={m}>
                              • {m}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() =>
                  createTemplateScenario(
                    template
                  )
                }
                className="
                  mt-6
                  w-full
                  rounded-2xl
                  bg-gradient-to-r
                  from-indigo-500
                  to-cyan-400
                  px-4 py-4
                  font-bold
                  text-white
                  shadow-lg
                  shadow-indigo-500/20
                "
              >
                Создать сценарий
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}