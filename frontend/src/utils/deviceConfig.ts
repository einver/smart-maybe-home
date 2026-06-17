import { DeviceType } from "../shared/deviceTypes";

export const deviceConfig: Record<DeviceType, { parameters: string[] }> = {
  Lamp: {
    parameters: ["power", "brightness"]
  },
  Sensor: {
    parameters: ["temperature", "motion", "occupancy", "illuminance"]
  },
  AC: {
    parameters: ["power", "targetTemp", "mode"]
  },
  Heater: {
    parameters: ["power"]
  },
  Motor: {
    parameters: ["position"]
  }
};