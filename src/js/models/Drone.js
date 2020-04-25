import config from "../config.json";

const EventEmitter = require("events");

export default class Drone extends EventEmitter {
  constructor(marker, currentTarget) {
    super();
    this.id = marker.options.id;
    this.marker = marker;
    this.attitudeIndicator = undefined;
    this.currentTarget = currentTarget;
    this.battery = 100;
    this.startTime = new Date().getTime();
    this.stopped = false;
  }

  getBattery() {
    if (this.battery === 0) return 0;
    const now = new Date().getTime();
    let diff = now - this.startTime;
    if (diff > 400 + this.id * 1000) {
      this.startTime = now;
      if (this.battery > 0) this.battery--;
      if (this.battery === config.events.lowBattery) this.emit("lowBattery", this);
      else if (this.battery === config.events.extremeLowBattery)
        this.emit("extremeLowBattery", this);
      else if (this.battery === 0) this.emit("stop", this);
    }
    return this.battery;
  }
}
