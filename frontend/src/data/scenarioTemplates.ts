export type ScenarioTemplate = {
  id: string;
  name: string;
  description: string;
  icon: string;

  requiredDevices: string[];

  conditions: {
    deviceType: string;
    parameter: string;
    operator: string;
    value: any;
  }[];

  actions: {
    deviceType: string;
    field: string;
    value: any;
  }[];
};

export const scenarioTemplates: ScenarioTemplate[] = [
  {
    id: "night-light",
    name: "Ночное освещение",
    description:
      "Включать свет при обнаружении движения ночью",

    icon: "🌙",

    requiredDevices: ["Sensor", "Lamp"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "motion",
        operator: "=",
        value: true
      }
    ],

    actions: [
      {
        deviceType: "Lamp",
        field: "power",
        value: true
      }
    ]
  },

  {
    id: "temperature-control",
    name: "Контроль температуры",

    description:
      "Включать обогреватель при низкой температуре",

    icon: "🔥",

    requiredDevices: ["Sensor", "Heater"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "temperature",
        operator: "<",
        value: 20
      }
    ],

    actions: [
      {
        deviceType: "Heater",
        field: "power",
        value: true
      }
    ]
  },

  {
    id: "auto-ventilation",
    name: "Автопроветривание",

    description:
      "Открывать окно при высокой температуре",

    icon: "🪟",

    requiredDevices: ["Sensor", "Motor"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "temperature",
        operator: ">",
        value: 28
      }
    ],

    actions: [
      {
        deviceType: "Motor",
        field: "position",
        value: 100
      }
    ]
  },

  {
    id: "ac-control",
    name: "Автокондиционер",

    description:
      "Запуск кондиционера при жаре",

    icon: "❄️",

    requiredDevices: ["Sensor", "AC"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "temperature",
        operator: ">",
        value: 26
      }
    ],

    actions: [
      {
        deviceType: "AC",
        field: "power",
        value: true
      }
    ]
  },

  {
    id: "auto-light-off",

    name: "Выключение света",

    description:
      "Выключать свет при отсутствии движения",

    icon: "💡",

    requiredDevices: ["Sensor", "Lamp"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "motion",
        operator: "=",
        value: false
      }
    ],

    actions: [
      {
        deviceType: "Lamp",
        field: "power",
        value: false
      }
    ]
  },

  {
    id: "energy-saving",

    name: "Энергосбережение",

    description:
      "Выключать обогреватель при высокой температуре",

    icon: "⚡",

    requiredDevices: ["Sensor", "Heater"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "temperature",
        operator: ">",
        value: 24
      }
    ],

    actions: [
      {
        deviceType: "Heater",
        field: "power",
        value: false
      }
    ]
  },

  {
    id: "close-window",

    name: "Закрытие окна",

    description:
      "Закрывать окно при понижении температуры",

    icon: "🔒",

    requiredDevices: ["Sensor", "Motor"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "temperature",
        operator: "<",
        value: 18
      }
    ],

    actions: [
      {
        deviceType: "Motor",
        field: "position",
        value: 0
      }
    ]
  },

  {
    id: "night-mode",

    name: "Ночной режим",

    description:
      "При движении включать только слабое освещение",

    icon: "🌃",

    requiredDevices: ["Sensor", "Lamp"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "motion",
        operator: "=",
        value: true
      }
    ],

    actions: [
      {
        deviceType: "Lamp",
        field: "brightness",
        value: 20
      }
    ]
  },

  {
    id: "dark-room",

    name: "Темная комната",

    description:
      "Включать свет при низкой освещенности",

    icon: "🌑",

    requiredDevices: ["Sensor", "Lamp"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "illuminance",
        operator: "<",
        value: 50
      }
    ],

    actions: [
      {
        deviceType: "Lamp",
        field: "power",
        value: true
      }
    ]
  },

  {
    id: "heat-protection",

    name: "Защита от жары",

    description:
      "Открывать окно и запускать кондиционер",

    icon: "☀️",

    requiredDevices: ["Sensor", "Motor", "AC"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "temperature",
        operator: ">",
        value: 30
      }
    ],

    actions: [
      {
        deviceType: "Motor",
        field: "position",
        value: 100
      },
      {
        deviceType: "AC",
        field: "power",
        value: true
      }
    ]
  },

  {
    id: "low-battery",

    name: "Низкий заряд датчика",

    description:
      "Отслеживание разряда батареи",

    icon: "🔋",

    requiredDevices: ["Sensor"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "battery",
        operator: "<",
        value: 20
      }
    ],

    actions: []
  },

  {
    id: "weak-signal",

    name: "Слабый сигнал",

    description:
      "Контроль качества Zigbee связи",

    icon: "📡",

    requiredDevices: ["Sensor"],

    conditions: [
      {
        deviceType: "Sensor",
        parameter: "linkquality",
        operator: "<",
        value: 50
      }
    ],

    actions: []
  }
];