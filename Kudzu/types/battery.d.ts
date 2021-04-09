interface ChargingChangedEvent extends Event {
    type: "chargingchange";
    charging: boolean;
}

interface ChargingTimeChangedEvent extends Event {
    type: "chargingtimechange";
    chargingTime: number;
}

interface DischargingTimeChangedEvent extends Event {
    type: "dischargingtimechange";
    dischargingTime: number;
}

interface LevelChangedEvent extends Event {
    type: "levelchange";
    level: number;
}

interface BatteryManagerEvents {
    chargingchange: ChargingChangedEvent;
    chargingtimechange: ChargingTimeChangedEvent;
    dischargingtimechange: DischargingTimeChangedEvent;
    levelchange: LevelChangedEvent;
}

interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;

    onchargingchange: (evt: ChargingChangedEvent) => void;
    onchargingtimechange: (evt: ChargingTimeChangedEvent) => void;
    ondischargingtimechange: (evt: DischargingTimeChangedEvent) => void;
    onlevelchange: (evt: LevelChangedEvent) => void;
}

interface BatteryNavigator extends Navigator {
    getBattery(): Promise<BatteryManager>;
}