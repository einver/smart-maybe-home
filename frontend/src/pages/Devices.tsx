import { useEffect, useState } from "react";
import api from "../api/api";

import { DeviceType } from "../shared/deviceTypes";

import {
  CpuChipIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

import DeviceCard from "../components/DeviceCard";


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

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [name, setName] = useState("");
  const [type, setType] = useState<DeviceType>(DeviceType.Lamp);
  const [roomId, setRoomId] = useState("");

  
  const [connectionType, setConnectionType] =
    useState<ConnectionType>("Virtual");

  const [externalId, setExternalId] =
    useState("");

  const [mqttTopic, setMqttTopic] = useState("");

  const [sliderValues, setSliderValues] =
    useState<Record<string, number>>({});

  const loadData = async () => {
    const devRes = await api.get("/devices");
    const roomRes = await api.get("/rooms");

    const incomingDevices = [...devRes.data].sort(
      (a, b) => a.name.localeCompare(b.name)
    );

    setDevices(prev => {
      return incomingDevices.map(
        (newDevice: Device) => {
          const oldDevice = prev.find(
            d => d.id === newDevice.id
          );

          if (
            oldDevice &&
            oldDevice.stateJson ===
              newDevice.stateJson &&
            oldDevice.name === newDevice.name &&
            oldDevice.roomId === newDevice.roomId &&
            oldDevice.type === newDevice.type
          ) {
            return oldDevice;
          }

          return newDevice;
        }
      );
    });

    setRooms(roomRes.data);
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 3000);

    return () => clearInterval(interval);
  }, []);

  const createDevice = async () => {
    if (!name || !roomId) return;

    await api.post("/devices", {
      name,
      type,
      roomId,

      connectionType,

      mqttTopic:
        connectionType === "MQTT"
          ? mqttTopic
          : connectionType === "Zigbee"
          ? `zigbee2mqtt/${externalId}`
          : null,

      externalId:
        connectionType === "Zigbee"
          ? externalId
          : null
    });

    setName("");
    setMqttTopic("");

    loadData();
  };

  const deleteDevice = async (id: string) => {
    await api.delete(`/devices/${id}`);
    loadData();
  };

  const updateState = async (
    device: Device,
    newState: any
  ) => {
    const updated = {
      ...device,
      stateJson: JSON.stringify(newState)
    };

    setDevices(prev =>
      prev.map(d =>
        d.id === device.id ? updated : d
      )
    );

    try {
      await api.put(`/devices/${device.id}/state`, {
        stateJson: JSON.stringify(newState)
      });
    } catch (err) {
      console.error(err);
      loadData();
    }
  };

  const toggleDevice = async (device: Device) => {
    const current = JSON.parse(
      device.stateJson || "{}"
    );

    updateState(device, {
      ...current,
      power: !current.power
    });
  };

  return (
    <div className="space-y-8 fade-in">
      {/* HEADER */}

      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-600">
            <CpuChipIcon className="h-4 w-4" />
            Устройства умного дома
          </div>

          <h1 className="text-5xl font-black tracking-tight text-slate-800">
            Центр Управления Устройствами
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-slate-500">
            Управляйте датчиками, двигателями, лампами и устройствами MQTT в современной панели автоматизации.
          </p>
        </div>

        {/* CREATE */}

        <div className="glass-card w-full max-w-3xl rounded-[28px] p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
              <BoltIcon className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Добавить устройство
              </h3>

              <p className="text-sm text-slate-500">
                Подключите ваше виртуальное устройство
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              placeholder="Имя устройства"
              value={name}
              onChange={e => setName(e.target.value)}
              className="app-input"
            />

            <select
              value={type}
              onChange={e =>
                setType(e.target.value as DeviceType)
              }
              className="app-input"
            >
              {Object.values(DeviceType).map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              className="app-input"
            >
              <option value="">Комната</option>

              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <select
              value={connectionType}
              onChange={e =>
                setConnectionType(
                  e.target.value as ConnectionType
                )
              }
              className="app-input"
            >
              <option value="Virtual">
                Virtual
              </option>

              <option value="MQTT">
                MQTT
              </option>

              <option value="Zigbee">
                Zigbee
              </option>
            </select>

            {connectionType === "MQTT" && (
              <input
                placeholder="MQTT topic"
                value={mqttTopic}
                onChange={e =>
                  setMqttTopic(e.target.value)
                }
                className="app-input"
              />
            )}

            {connectionType === "Zigbee" && (
              <input
                placeholder="Friendly name"
                value={externalId}
                onChange={e =>
                  setExternalId(e.target.value)
                }
                className="app-input"
              />
            )}
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={createDevice}
              className="btn-primary"
            >
              Добавить
            </button>
          </div>
        </div>
      </div>

      {/* GRID */}

      <div className="grid items-start grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {devices.map(d => (
          <DeviceCard
            key={d.id}
            device={d}
            rooms={rooms}
            sliderValues={sliderValues}
            setSliderValues={setSliderValues}
            updateState={updateState}
            toggleDevice={toggleDevice}
            deleteDevice={deleteDevice}
          />
        ))}
      </div>
    </div>
  );
}