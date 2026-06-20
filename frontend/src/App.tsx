import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Rooms from "./pages/Rooms";
import Devices from "./pages/Devices";
import Scenarios from "./pages/Scenarios";
import ScenarioDetails from "./pages/ScenarioDetails";
import ScenarioLogs from "./pages/ScenarioLogs";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ScenarioTemplates from "./pages/ScenarioTemplates";
import TelegramSettings from "./pages/TelegramSettings";
import Register from "./pages/Register";

function PrivateRoute({ children }: any) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* 🔓 public */}
          <Route path="/login" element={<Login />} />

          {/* 🔒 protected */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/rooms"
            element={
              <PrivateRoute>
                <Rooms />
              </PrivateRoute>
            }
          />

          <Route
            path="/devices"
            element={
              <PrivateRoute>
                <Devices />
              </PrivateRoute>
            }
          />

          <Route
            path="/scenarios"
            element={
              <PrivateRoute>
                <Scenarios />
              </PrivateRoute>
            }
          />

          <Route
            path="/scenarios/:id"
            element={
              <PrivateRoute>
                <ScenarioDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/logs"
            element={
              <PrivateRoute>
                <ScenarioLogs />
              </PrivateRoute>
            }
          />

          <Route
            path="/scenario-templates"
            element={
              <PrivateRoute>
                <ScenarioTemplates />
              </PrivateRoute>
            }
          />

          <Route
            path="/TelegramSettings"
            element={
              <PrivateRoute>
                <TelegramSettings/>
              </PrivateRoute>
            }
          />

          <Route
            path="/register"
            element={<Register />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;