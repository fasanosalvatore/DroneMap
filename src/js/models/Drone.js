export default class Drone {
  constructor(marker, currentTarget) {
    this.id = marker.options.id;
    this.marker = marker;
    this.currentTarget = currentTarget;
  }
}
