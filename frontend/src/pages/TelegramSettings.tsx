import { useEffect, useState } from "react";
import api from "../api/api";
import tg_bot_qr from '../images/tg_bot_qr.png'

export default function TelegramSettings() {
  const [chatId, setChatId] = useState("");
  const [qrOpened, setQrOpened] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get("/users/telegram");

    if (res.data.telegramChatId) {
      setChatId(res.data.telegramChatId.toString());
    }
  }

  async function save() {
    await api.post("/users/telegram", {
      chatId: Number(chatId),
    });

    alert("Telegram подключён");
  }

  async function unlink() {
    await api.delete("/users/telegram");

    setChatId("");

    alert("Telegram отключён");
  }

  async function testTelegram() {
    await api.get("/users/test-telegram");

    alert("Сообщение отправлено");
    }

  return (
    <div className="space-y-8 fade-in">
      <div className="glass-card rounded-[32px] p-8">
        <div className="flex items-center gap-4">
          <div
            className="
              flex h-14 w-14 items-center justify-center
              rounded-2xl
              bg-gradient-to-br
              from-sky-500
              to-cyan-400
              text-white
              text-2xl
            "
          >
            ✈️
          </div>

          <div>
            <h1 className="text-4xl font-black text-slate-800">
              Telegram
            </h1>

            <p className="mt-2 text-slate-500">
              Подключение уведомлений Smart Home
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[32px] p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Инструкция
        </h2>

        <div className="space-y-2 text-slate-600">
          <p>1. Откройте Telegram-бота</p>
          <p>2. Отправьте команду /start</p>
          <p>3. Бот покажет ваш Chat ID</p>
          <p>4. Вставьте его ниже</p>
        </div>

        <a
          href="https://t.me/SmartHomeNotSmartBot"
          target="_blank"
          rel="noreferrer"
          className="
            inline-block mt-6
            rounded-2xl
            bg-sky-500
            px-5 py-3
            font-semibold
            text-white
          "
        >
          Открыть Telegram-бота
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-[32px] p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            QR-код
          </h2>

          <div className="flex flex-col items-center">
            <img
              src={tg_bot_qr}
              alt="qr код телеги"
              onClick={() => setQrOpened(true)}
              className="
                h-56 w-56
                cursor-pointer
                rounded-2xl
                transition
                hover:scale-105
                hover:shadow-xl
              "
            />

            <p className="mt-4 text-center text-sm text-slate-500">
              Отсканируйте QR-код телефоном
              <br />
              или нажмите на него для увеличения
            </p>
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Chat ID
          </h2>

          <input
            type="number"
            value={chatId}
            onChange={(e) =>
              setChatId(e.target.value)
            }
            className="app-input"
            placeholder="Telegram Chat ID"
          />

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={save}
              className="
                rounded-2xl
                bg-sky-500
                py-3
                font-semibold
                text-white
              "
            >
              Сохранить
            </button>

            <button
              onClick={testTelegram}
              className="
                rounded-2xl
                bg-emerald-500
                py-3
                font-semibold
                text-white
              "
            >
              Проверить Telegram
            </button>

            <button
              onClick={unlink}
              className="
                rounded-2xl
                bg-red-500
                py-3
                font-semibold
                text-white
              "
            >
              Отвязать
            </button>
          </div>
        </div>
        {qrOpened && (
          <div
            onClick={() => setQrOpened(false)}
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              bg-black/80
              backdrop-blur-sm
              cursor-pointer
            "
          >
            <img
              src={tg_bot_qr}
              alt="QR"
              className="
                max-h-[90vh]
                max-w-[90vw]
                rounded-3xl
                shadow-2xl
              "
            />
          </div>
        )}
      </div>
    </div>
  );
}