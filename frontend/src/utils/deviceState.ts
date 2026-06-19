import { DeviceType } from "../shared/deviceTypes";
import type {
  DeviceStateMap,
  LampState,
  SensorState,
  ACState,
  HeaterState,
  MotorState
} from "../shared/deviceStates";


// универсальный парсер
export function parseDeviceState<T extends DeviceType>(
  _type: T,
  json: string
): DeviceStateMap[T] | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// TYPE GUARDS

export function isLampState(
  type: DeviceType,
  state: any
): state is LampState {
  return type === DeviceType.Lamp && state !== null;
}

export function isSensorState(
  type: DeviceType,
  state: any
): state is SensorState {
  return type === DeviceType.Sensor && state !== null;
}

export function isACState(
  type: DeviceType,
  state: any
): state is ACState {
  return type === DeviceType.AC && state !== null;
}

export function isHeaterState(
  type: DeviceType,
  state: any
): state is HeaterState {
  return type === DeviceType.Heater && state !== null;
}

export function isMotorState(
  type: DeviceType,
  state: any
): state is MotorState {
  return type === DeviceType.Motor && state !== null;
}