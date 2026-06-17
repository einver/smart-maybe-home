import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CpuChipIcon,
  RectangleGroupIcon,
  BoltIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Layout({ children }: any) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const links = [
    {
      to: "/",
      label: "Дашборд",
      icon: HomeIcon
    },
    {
      to: "/rooms",
      label: "Комнаты",
      icon: RectangleGroupIcon
    },
    {
      to: "/devices",
      label: "Устройства",
      icon: CpuChipIcon
    },
    {
      to: "/scenarios",
      label: "Сценарии",
      icon: BoltIcon
    },
    {
      to: "/logs",
      label: "Логи",
      icon: ClockIcon
    },
    {
      to: "/TelegramSettings",
      label: "Телеграм",
      icon: PaperAirplaneIcon
    }
  ];

  return (
    <div className="min-h-screen text-slate-800">
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-[290px]
          border-r border-white/40
          bg-white/75
          backdrop-blur-2xl
          transition-transform duration-300
          shadow-[0_10px_40px_rgba(99,102,241,0.12)]
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* LOGO */}
          <div className="border-b border-slate-200/70 px-6 py-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div
                  className="
                    flex h-12 w-12 items-center justify-center
                    rounded-2xl
                    bg-gradient-to-br from-indigo-500 to-cyan-400
                    text-lg font-black text-white
                    shadow-lg shadow-indigo-500/20
                  "
                >
                  SH
                </div>

                <div>
                  <div className="text-xl font-black text-slate-800">
                    SmartHome
                  </div>

                  <div className="text-sm text-slate-500">
                    Автоматизированная система
                  </div>
                </div>
              </Link>

              <button
                onClick={() => setOpen(false)}
                className="
                  rounded-xl p-2 text-slate-500
                  transition hover:bg-slate-100
                  lg:hidden
                "
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {links.map(link => {
              const active = location.pathname === link.to;

              const Icon = link.icon;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`
                    group flex items-center gap-4
                    rounded-2xl px-4 py-4
                    transition-all duration-200
                    ${
                      active
                        ? `
                          bg-gradient-to-r
                          from-indigo-500
                          to-cyan-400
                          text-white
                          shadow-lg shadow-indigo-500/20
                        `
                        : `
                          text-slate-600
                          hover:bg-white
                          hover:text-slate-900
                          hover:shadow-md
                        `
                    }
                  `}
                >
                  <Icon
                    className={`
                      h-6 w-6 transition
                      ${
                        active
                          ? "text-white"
                          : "text-slate-400 group-hover:text-indigo-500"
                      }
                    `}
                  />

                  <span className="font-semibold">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* FOOTER */}
          <div className="border-t border-slate-200/70 p-4">
            {!token ? (
              <Link
                to="/login"
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl border border-slate-200
                  bg-white px-4 py-3
                  font-semibold text-slate-700
                  transition hover:bg-slate-50
                "
              >
                Войти
              </Link>
            ) : (
              <button
                onClick={logout}
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-rose-500
                  to-red-500
                  px-4 py-3
                  font-semibold text-white
                  shadow-lg shadow-red-500/20
                  transition hover:scale-[1.01]
                "
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />

                Выйти
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="lg:ml-[290px]">
        {/* MOBILE HEADER */}
        <header
          className="
            sticky top-0 z-30
            border-b border-white/40
            bg-white/70
            backdrop-blur-2xl
            lg:hidden
          "
        >
          <div className="flex items-center justify-between px-5 py-4">
            <button
              onClick={() => setOpen(true)}
              className="
                rounded-xl p-2
                text-slate-700
                transition hover:bg-white
              "
            >
              <Bars3Icon className="h-7 w-7" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  bg-gradient-to-br from-indigo-500 to-cyan-400
                  font-bold text-white
                "
              >
                SH
              </div>

              <div>
                <div className="font-black text-slate-800">
                  SmartHome
                </div>

                <div className="text-xs text-slate-500">
                  Дашборд
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="min-h-screen p-4 md:p-6 xl:p-8">
          <div className="mx-auto max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}