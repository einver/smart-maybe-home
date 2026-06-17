import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { deviceConfig } from "../utils/deviceConfig";

type Device = {
  id: string;
  name: string;
  type: string;
};

type Condition = {
  id: string;
  deviceId: string;
  parameter: string;
  operator: string;
  value: string;
  logicalOperator: string;
};

type Action = {
  id: string;
  deviceId: string;
  actionType: string;
  value: string;
};

export default function ScenarioDetails() {
  const { id } = useParams();

  const [devices, setDevices] = useState<Device[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [actions, setActions] = useState<Action[]>([]);

  const [newCondition, setNewCondition] = useState({
    deviceId: "",
    parameter: "",
    operator: "=",
    value: "",
    logicalOperator: "AND"
  });

  const [newAction, setNewAction] = useState({
    deviceId: "",
    field: "",
    value: ""
  });
  

  const loadData = async () => {

    const scenarioRes =
      await api.get(`/scenarios/${id}`);

    setSendTelegramNotification(
      scenarioRes.data.sendTelegramNotification
    );

    setNotificationText(
      scenarioRes.data.notificationText ?? ""
    );

    const devRes = await api.get("/devices");

    const condRes = await api
      .get(`/conditions/${id}`)
      .catch(() => ({ data: [] }));

    const actRes = await api
      .get(`/actions/${id}`)
      .catch(() => ({ data: [] }));

    setDevices(devRes.data);
    setConditions(condRes.data);
    setActions(actRes.data);
  };

  const [
    sendTelegramNotification,
    setSendTelegramNotification
  ] = useState(false);

  const [
    notificationText,
    setNotificationText
  ] = useState("");

  const saveTelegramSettings = async () => {
    await api.put(
      `/scenarios/${id}/notifications`,
      {
        sendTelegramNotification,
        notificationText
      }
    );

    alert("Настройки уведомлений сохранены");
  };

  useEffect(() => {
    loadData();
  }, []);

  const getDeviceType = (deviceId: string) =>
    devices.find(d => d.id === deviceId)?.type;

  const getParameters = (deviceId: string) => {
    const type = getDeviceType(deviceId);

    if (!type) return [];

    return deviceConfig[type as keyof typeof deviceConfig]
      ?.parameters || [];
  };

  const addCondition = async () => {
    try {
      if (!newCondition.deviceId || !newCondition.parameter)
        return;

      await api.post("/conditions", {
        scenarioId: id,
        deviceId: newCondition.deviceId,
        parameter: newCondition.parameter,
        operator: newCondition.operator,
        value: newCondition.value,
        logicalOperator: newCondition.logicalOperator
      });

      setNewCondition({
        deviceId: "",
        parameter: "",
        operator: "=",
        value: "",
        logicalOperator: "AND"
      });

      loadData();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  const deleteCondition = async (cid: string) => {
    await api.delete(`/conditions/${cid}`);
    loadData();
  };

  const addAction = async () => {
    try {
      if (!newAction.deviceId || !newAction.field) return;

      const valueJson = JSON.stringify({
        [newAction.field]:
          newAction.value === "true"
            ? true
            : newAction.value === "false"
            ? false
            : isNaN(Number(newAction.value))
            ? newAction.value
            : Number(newAction.value)
      });

      await api.post("/actions", {
        scenarioId: id,
        deviceId: newAction.deviceId,
        actionType: "SET_STATE",
        value: valueJson
      });

      setNewAction({
        deviceId: "",
        field: "",
        value: ""
      });

      loadData();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  const deleteAction = async (aid: string) => {
    await api.delete(`/actions/${aid}`);
    loadData();
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <div className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
          Автоматизация
        </div>

        <h1 className="mt-4 text-4xl font-black text-slate-800">
          Редактор сценариев
        </h1>

        <p className="mt-3 max-w-2xl text-slate-500">
          Настройте условия и действия для вашего рабочего процесса автоматизации.
        </p>
      </div>

      {/* CONDITIONS */}
      <div className="glass-card rounded-[30px] p-6 md:p-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              Условия
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Выберите, когда сценарий сработает
            </p>
          </div>

          <div className="badge badge-primary">
            {conditions.length} conditions
          </div>
        </div>

        {/* FORM */}
        <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-6">
          <select
            value={newCondition.deviceId}
            onChange={e =>
              setNewCondition({
                ...newCondition,
                deviceId: e.target.value,
                parameter: ""
              })
            }
            className="app-input"
          >
            <option value="">Устройство</option>

            {devices.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={newCondition.parameter}
            onChange={e =>
              setNewCondition({
                ...newCondition,
                parameter: e.target.value
              })
            }
            className="app-input"
          >
            <option value="">Параметр</option>

            {getParameters(newCondition.deviceId).map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={newCondition.operator}
            onChange={e =>
              setNewCondition({
                ...newCondition,
                operator: e.target.value
              })
            }
            className="app-input"
          >
            <option value="=">=</option>
            <option value="!=">!=</option>
            <option value=">">{">"}</option>
            <option value="<">{"<"}</option>
            <option value=">=">{">="}</option>
            <option value="<=">{"<="}</option>
          </select>

          <input
            placeholder="Значение"
            value={newCondition.value}
            onChange={e =>
              setNewCondition({
                ...newCondition,
                value: e.target.value
              })
            }
            className="app-input"
          />

          <button
            onClick={addCondition}
            className="btn-primary"
          >
            Добавить
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {conditions.map(c => {
            const deviceName =
              devices.find(d => d.id === c.deviceId)?.name ||
              "Device";

            return (
              <div
                key={c.id}
                className="
                  float-card
                  flex flex-col gap-4
                  rounded-[26px]
                  border border-white/60
                  bg-white/80
                  p-5
                  shadow-sm
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge badge-primary">
                      {deviceName}
                    </span>

                    <span className="text-slate-400">
                      →
                    </span>

                    <span className="font-semibold text-slate-700">
                      {c.parameter}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                      {c.operator}
                    </span>

                    <span className="font-semibold text-indigo-600">
                      {c.value}
                    </span>
                  </div>

                  {/* <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {c.logicalOperator}
                  </div> */}
                </div>

                <button
                  onClick={() => deleteCondition(c.id)}
                  className="
                    self-start rounded-2xl
                    bg-red-50 px-4 py-2
                    font-semibold text-red-500
                    transition hover:bg-red-500
                    hover:text-white
                  "
                >
                  Удалить
                </button>
              </div>
            );
          })}
        </div>
      </div>
      

      {/* ACTIONS */}
      <div className="glass-card rounded-[30px] p-6 md:p-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              Действия
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Настройте, что произойдет после выполнения условий.
            </p>
          </div>

          <div className="badge badge-success">
            {actions.length} actions
          </div>
        </div>

        {/* FORM */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <select
            value={newAction.deviceId}
            onChange={e =>
              setNewAction({
                ...newAction,
                deviceId: e.target.value,
                field: ""
              })
            }
            className="app-input"
          >
            <option value="">Устройство</option>

            {devices.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={newAction.field}
            onChange={e =>
              setNewAction({
                ...newAction,
                field: e.target.value
              })
            }
            className="app-input"
          >
            <option value="">Параметр</option>

            {getParameters(newAction.deviceId).map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <input
            placeholder="Значение"
            value={newAction.value}
            onChange={e =>
              setNewAction({
                ...newAction,
                value: e.target.value
              })
            }
            className="app-input"
          />

          <button
            onClick={addAction}
            className="
              rounded-[20px]
              bg-emerald-500
              px-5 py-3
              font-bold
              text-white
              shadow-lg shadow-emerald-500/20
              transition hover:-translate-y-0.5
              hover:bg-emerald-400
            "
          >
            Добавить
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {actions.map(a => {
            const deviceName =
              devices.find(d => d.id === a.deviceId)?.name ||
              "Device";

            return (
              <div
                key={a.id}
                className="
                  float-card
                  flex flex-col gap-4
                  rounded-[26px]
                  border border-white/60
                  bg-white/80
                  p-5
                  shadow-sm
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge badge-success">
                      {deviceName}
                    </span>

                    <span className="text-slate-400">
                      →
                    </span>

                    <span className="font-mono text-sm text-slate-700">
                      {a.value}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteAction(a.id)}
                  className="
                    self-start rounded-2xl
                    bg-red-50 px-4 py-2
                    font-semibold text-red-500
                    transition hover:bg-red-500
                    hover:text-white
                  "
                >
                  Удалить
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* TELEGRAM */}
      <div className="glass-card rounded-[30px] p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-800">
            Telegram уведомления
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Отправлять сообщение при выполнении сценария
          </p>
        </div>

        <div className="space-y-5">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={sendTelegramNotification}
              onChange={(e) =>
                setSendTelegramNotification(
                  e.target.checked
                )
              }
            />

            <span className="font-semibold">
              Отправлять уведомление
            </span>
          </label>

          {sendTelegramNotification && (
            <textarea
              value={notificationText}
              onChange={(e) =>
                setNotificationText(
                  e.target.value
                )
              }
              rows={4}
              placeholder="Например: Обнаружено движение в гостиной"
              className="app-input w-full"
            />
          )}

          <button
            onClick={saveTelegramSettings}
            className="
              rounded-[20px]
              bg-indigo-600
              px-5 py-3
              font-bold
              text-white
            "
          >
            Сохранить уведомления
          </button>
        </div>
      </div>
    </div>
  );
}