import { useEffect, useState } from "react";
import api from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type Props = {
  deviceId: string;
};

type Event = {
  createdAt: string;
  valueJson: string;
};

export default function TemperatureChart({ deviceId }: Props) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, [deviceId]);

  const load = async () => {
    const res = await api.get(`/deviceevents/device/${deviceId}`);

    const formatted = res.data.map((e: Event) => {
      try {
        const parsed = JSON.parse(e.valueJson);

        return {
          time: new Date(e.createdAt).toLocaleTimeString(),
          temperature: parsed.temperature
        };
      } catch {
        return null;
      }
    }).filter(Boolean);

    setData(formatted);
  };

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          {/* <Line type="monotone" dataKey="temperature" /> */}
           <Line
              type="monotone"
              dataKey="temperature"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ fill: "#4f46e5" }}
              activeDot={{ r: 8, stroke: "#fff", strokeWidth: 3 }}
            />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}