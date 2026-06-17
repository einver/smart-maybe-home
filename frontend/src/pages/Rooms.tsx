import { useEffect, useState } from "react";
import api from "../api/api";

type Room = {
  id: string;
  name: string;
};

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState("");

  const loadRooms = async () => {
    const res = await api.get("/rooms");
    setRooms(res.data);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const createRoom = async () => {
    if (!name) return;

    await api.post("/rooms", { name });

    setName("");
    loadRooms();
  };

  const deleteRoom = async (id: string) => {
    await api.delete(`/rooms/${id}`);
    loadRooms();
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            Умные пространства
          </div>

          <h1 className="mt-4 text-4xl font-black text-slate-800">
            Комнаты
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Организуйте устройства и сценарии в своей умной домашней среде.
          </p>
        </div>

        {/* CREATE */}
        <div className="glass-card flex w-full max-w-xl flex-col gap-3 rounded-[28px] p-4 sm:flex-row">
          <input
            placeholder="Название комнаты"
            value={name}
            onChange={e => setName(e.target.value)}
            className="app-input flex-1"
          />

          <button
            onClick={createRoom}
            className="btn-primary whitespace-nowrap"
          >
            Добавить комнату
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
        {rooms.map(r => (
          <div
            key={r.id}
            className="
              glass-card float-card
              relative overflow-hidden
              rounded-[32px]
              p-7
            "
          >
            {/* DECOR */}
            <div
              className="
                absolute right-0 top-0
                h-36 w-36 rounded-full
                bg-gradient-to-br
                from-indigo-200/50
                to-cyan-100/10
                blur-3xl
              "
            />

            <div className="relative z-10">
              <div
                className="
                  mb-5 flex h-16 w-16
                  items-center justify-center
                  rounded-3xl
                  bg-gradient-to-br
                  from-indigo-500
                  to-cyan-400
                  text-3xl
                  text-white
                  shadow-lg
                  shadow-indigo-500/20
                "
              >
                🏠
              </div>

              <h3 className="break-words text-3xl font-black text-slate-800">
                {r.name}
              </h3>

              <button
                onClick={() => deleteRoom(r.id)}
                className="
                  mt-8 w-full
                  rounded-[22px]
                  bg-red-50 px-5 py-3
                  font-semibold
                  text-red-500
                  transition-all
                  hover:bg-red-500
                  hover:text-white
                "
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}