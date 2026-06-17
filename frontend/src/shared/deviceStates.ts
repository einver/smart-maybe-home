import { DeviceType } from "./deviceTypes";

export type LampState = {
  power: boolean;
  brightness?: number;
};

export type SensorState = {
  // универсальные сенсоры
  temperature?: number;
  humidity?: number;

  // датчики движения
  motion?: boolean;
  occupancy?: boolean;

  // датчики освещённости
  illuminance?: number;
  illuminance_interval?: number;

  // батарейные устройства
  battery?: number;

  // качество Zigbee-связи
  linkquality?: number;

  // настройки некоторых Zigbee датчиков
  keep_time?: string;
  sensitivity?: string;
};

export type ACState = {
  power: boolean;
  targetTemp: number;
  mode?: "cool" | "heat" | "fan";
};

export type HeaterState = {
  power: boolean;
};

export type MotorState = {
  position: number;
};

export type DeviceStateMap = {
  [DeviceType.Lamp]: LampState;
  [DeviceType.Sensor]: SensorState;
  [DeviceType.AC]: ACState;
  [DeviceType.Heater]: HeaterState;
  [DeviceType.Motor]: MotorState;
};