import horizon_back from "../../img/horizon_back.svg";
import horizon_ball from "../../img/horizon_ball.svg";
import horizon_circle from "../../img/horizon_circle.svg";
import horizon_mechanics from "../../img/horizon_mechanics.svg";
import fi_circle from "../../img/fi_circle.svg";

export default class AttitudeIndicator {
  constructor(htmlSelector, options) {
    this.htmlSelector = document.querySelector(htmlSelector);
    this.settings = {
      size: 200,
      roll: 0,
      pitch: 0,
      showBox: true,
      img_directory: "imgs/",
      pitch_bound: 30
    };
    this.settings = Object.assign(this.settings, options);
    this.loadAttitudeIndicator();
  }

  loadAttitudeIndicator() {
    const showBox = this.settings.showBox ? "" : "display: none;";
    const markup = `<div class="instrument attitude" style="width: ${this.settings.size}px; height: ${this.settings.size}px;">
        <img src="" class="background box" alt="" style="${showBox}" />
        <div class="roll box">
          <img src=${horizon_back} class="box" alt="" />
          <div class="pitch box">
            <img src=${horizon_ball} class="box" alt="" />
          </div>
          <img src=${horizon_circle} class="box" alt="" />
        </div>
        <div class="mechanics box">
          <img src=${horizon_mechanics} class="box" alt="" />
          <img src=${fi_circle} class="box" alt="" />
        </div>
      </div>`;
    this.htmlSelector.innerHTML = markup;
    this.setRoll(this.settings.roll);
    this.setPitch(this.settings.pitch);
  }

  setRoll(roll) {
    this.htmlSelector.querySelector(
      "div.instrument.attitude div.roll"
    ).style.transform = `rotate(${roll}deg)`;
  }

  setPitch(pitch) {
    if (pitch > this.settings.pitch_bound) {
      pitch = this.settings.pitch_bound;
    } else if (pitch < -this.settings.pitch_bound) {
      pitch = -this.settings.pitch_bound;
    }
    this.htmlSelector.querySelector(
      "div.instrument.attitude div.roll div.pitch"
    ).style.top = `${pitch * 0.7}%`;
  }
}
