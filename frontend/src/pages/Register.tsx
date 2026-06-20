import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  // const [name, _setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", {
        // name,
        email,
        password
      });

      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data ??
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-indigo-100 rounded-3xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-slate-800">
            Smart Home
          </h1>

          <p className="text-slate-600 mt-2">
            Создание нового аккаунта
          </p>
        </div>

        <div className="space-y-5">
          {/* <div>
            <label className="block text-slate-800 mb-2">
              Имя
            </label>

            <input
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
              placeholder="John Doe"
              value={name}
              onChange={e =>
                setName(e.target.value)
              }
            />
          </div> */}

          <div>
            <label className="block text-slate-800 mb-2">
              Почта
            </label>

            <input
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
              placeholder="example@mail.com"
              value={email}
              onChange={e =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-slate-800 mb-2">
              Пароль
            </label>

            <input
              type="password"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
              placeholder="••••••••"
              value={password}
              onChange={e =>
                setPassword(e.target.value)
              }
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 transition rounded-xl py-3 text-slate-950 font-semibold"
          >
            {loading
              ? "Creating..."
              : "Create account"}
          </button>

          <div className="text-center text-sm text-slate-600">
            Уже есть аккаунт?{" "}
            <Link
              to="/login"
              className="text-cyan-600 font-semibold hover:underline"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}