import L from "leaflet";
import "leaflet.marker.slideto";
import Notiflix from "notiflix";
Notiflix.Notify.Init({
  cssAnimationStyle: "from-right"
});

import { elements } from "./views/base";
import { droneIcon, targetIcon } from "./views/icons";
import { createCards, updateCard } from "./views/DroneCards";
import Drone from "./models/Drone";
import config from "./config.json";

const state = {
  isConnect: false,
  isPlay: false,
  takeOff: config.parameter.takeOff,
  targets: [],
  drones: []
};

var map = L.map("map").setView(state.takeOff, 13);
var tile = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "fasanosalvatore/ck6t2emzl02141isyp4ppu42o",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiZmFzYW5vc2FsdmF0b3JlIiwiYSI6ImNrNnA5czVxaDE5d3UzbnFzOWZwc2w4YXoifQ.k4wjJrEg9rapGMYjxlRmIg",
    detectRetina: true
  }
).addTo(map);

console.log(tile);

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
darkModeMediaQuery.addListener(e => {
  const darkModeOn = e.matches;
  let id = darkModeOn
    ? "fasanosalvatore/ck6t2emzl02141isyp4ppu42o"
    : "fasanosalvatore/ck77e1nmd022f1jqm9qgrsg4z";
  tile.options.id = id;
  tile.setUrl(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    false
  );
});

const nextTarget = (drone, target) => {
  if (state.isPlay) {
    drone.currentTarget = (drone.currentTarget + 1) % state.targets.length;
    let t = target || state.targets[drone.currentTarget].getLatLng();
    setTimeout(() => {
      drone.marker.slideTo(t, {
        duration: 6000
      });
    }, 500);
  } else {
    drone.marker.slideTo(state.takeOff, {
      duration: 6000
    });
  }
};

//CARICAMENTO DELLO SCENARIO
const loadScenario = () => {
  state.isConnect = true;
  config.targetpositions.map(target => state.targets.push(L.marker(target, { icon: targetIcon })));
  for (let i = 0; i < config.parameter.numberOfAircrafts; i++) {
    state.drones.push(new Drone(L.marker(state.takeOff, { id: i, icon: droneIcon }), i - 1));
  }
  state.targets.map(target => target.addTo(map));
  state.drones.map(drone => {
    drone.marker.on("moveend", e => {
      const id = e.sourceTarget.options.id;
      const drone = state.drones[id];
      if (drone.battery > config.events.extremeLowBattery) nextTarget(drone);
    });
    drone.marker.on("move", e => {
      const drone = state.drones[e.sourceTarget.options.id];
      updateCard(e.latlng, drone);
      if (drone.getBattery() === 0) nextTarget(drone, e.latlng);
    });
    drone.on("lowBattery", drone => {
      Notiflix.Notify.Warning(`Drone ${drone.id} è quasi scarico`);
    });
    drone.on("extremeLowBattery", drone => {
      Notiflix.Report.Failure(
        `Drone ${drone.id} è scarico`,
        "Il drone tornerà al takeOff",
        "Capito"
      );
      nextTarget(drone, state.takeOff);
    });
    drone.on("stop", drone => {
      //if (drone.battery === 0) drone.marker.slideCancel();
      console.log("stop");
    });
    drone.marker.addTo(map);
  });
  createCards(state.drones);
};

elements.connect.addEventListener("click", loadScenario);

//START DELLO SCENARIO
const startScenario = () => {
  if (state.isConnect) {
    state.isPlay = true;
    state.drones.map(drone => {
      nextTarget(drone);
    });
  } else {
    alert("Bisogna prima connettersi!");
  }
};

elements.play.addEventListener("click", startScenario);

//STOP DELLO SCENARIO
elements.stop.addEventListener("click", () => {
  state.isPlay = false;
  state.drones.map(drone => nextTarget(drone));
});
