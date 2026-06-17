import { DeviceType } from "../shared/deviceTypes";

export type ConnectionType =
  | "Virtual"
  | "MQTT"
  | "Zigbee";

export type Device = {
  id: string;
  name: string;
  type: DeviceType;
  roomId: string;
  stateJson: string;

  connectionType: ConnectionType;

  mqttTopic?: string;
  externalId?: string;
};