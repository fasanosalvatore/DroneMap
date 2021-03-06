import "../style.scss";
import L from "leaflet";
import "leaflet.marker.slideto";
import Notiflix from "notiflix";
Notiflix.Notify.Init({
  clickToClose: true,
  useGoogleFont: false,
  cssAnimationDuration: 800,
  cssAnimationStyle: "from-right",
  useIcon: false,
  warning: {
    background: "#C27803",
  },
  failure: {
    background: "#F05252",
  },
});

Notiflix.Report.Init({
  backgroundColor: "#f8f8f8",
  borderRadius: "5px",
  useGoogleFont: false,
  titleFontSize: "16px",
  messageFontSize: "13px",
  buttonFontSize: "14px",
  svgSize: "30px",
});

import { elements, distance } from "./views/base";
import { droneIcon, droneIconDark, targetIcon } from "./views/icons";
import { createCards, updateCard, updatePanel } from "./views/DroneCards";
import Drone from "./models/Drone";
import AttitudeIndicator from "./models/AttitudeIndicator";
import config from "./config.json";

const state = {
  isConnect: false,
  isPlay: false,
  velocity: 0,
  takeOff: config.parameter.takeOff,
  parkingTime: config.parameter.parkingTime,
  targets: [],
  drones: [],
};

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: light)");

darkModeMediaQuery.addListener((e) => {
  const darkModeOn = e.matches;
  const id = darkModeOn
    ? "fasanosalvatore/ck786fr9n2hzq1ipkub6s7dl1"
    : "fasanosalvatore/ck785ty7h164l1iplkonls44p";
  const icon = darkModeOn ? droneIconDark : droneIcon;
  tile.options.id = id;
  tile.setUrl(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    false
  );
  state.drones.map((d) => d.marker.setIcon(icon));
});

var map = L.map("map").setView(state.takeOff, 17);
var tile = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 30,
    id: darkModeMediaQuery.matches
      ? "fasanosalvatore/ck786fr9n2hzq1ipkub6s7dl1"
      : "fasanosalvatore/ck785ty7h164l1iplkonls44p",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiZmFzYW5vc2FsdmF0b3JlIiwiYSI6ImNrNnA5czVxaDE5d3UzbnFzOWZwc2w4YXoifQ.k4wjJrEg9rapGMYjxlRmIg",
    detectRetina: true,
  }
).addTo(map);

const nextTarget = (drone, target) => {
  if (state.isPlay && (!isNaN(drone.currentTarget.n) || drone.currentTarget.n !== "takeOff")) {
    drone.currentTarget = {
      n: (drone.currentTarget.n + 1) % state.targets.length,
      target: state.targets[(drone.currentTarget.n + 1) % state.targets.length].getLatLng(),
    };
    let t = target || state.targets[drone.currentTarget.n].getLatLng();
    setTimeout(() => {
      drone.marker.slideTo(t, {
        duration:
          distance(drone.marker.getLatLng().lat, drone.marker.getLatLng().lng, t.lat, t.lng, "K") /
          (state.velocity / 60 / 60 / 60 / 60),
      });
    }, state.parkingTime);
  } else {
    drone.marker.slideTo(state.takeOff, {
      duration:
        distance(
          drone.marker.getLatLng().lat,
          drone.marker.getLatLng().lng,
          state.takeOff.lat,
          state.takeOff.lng,
          "K"
        ) /
        (state.velocity / 60 / 60 / 60 / 60),
    });
  }
};

//CARICAMENTO DELLO SCENARIO
const loadScenario = () => {
  state.isConnect = true;
  const icon = darkModeMediaQuery.matches ? droneIconDark : droneIcon;
  elements.connect.querySelector(".connection-signal").classList.add("connected");
  config.targetpositions.map((target) =>
    state.targets.push(L.marker(target, { icon: targetIcon }))
  );
  for (let i = 0; i < config.parameter.numberOfAircrafts; i++) {
    state.drones.push(new Drone(L.marker(state.takeOff, { id: i, icon: icon }), { n: i - 1 }));
    state.drones[i].marker
      .bindTooltip("" + (i + 1), { direction: "center", permanent: true })
      .openTooltip();
  }
  state.velocity = config.parameter.minSpeedOfAircraft;
  state.targets.map((target) => target.addTo(map));
  state.drones.map((drone) => {
    drone.marker.on("moveend", (e) => {
      const id = e.sourceTarget.options.id;
      const drone = state.drones[id];
      if (drone.battery > config.events.extremeLowBattery) nextTarget(drone);
    });
    drone.marker.on("move", (e) => {
      if (distance(e.latlng.lat, e.latlng.lng, state.takeOff.lat, state.takeOff.lng, "K") > 0) {
        const drone = state.drones[e.sourceTarget.options.id];
        updateCard(e.latlng, drone);
        updatePanel(e.latlng, drone);
        if (drone.getBattery() === 0) {
          nextTarget(drone, e.latlng);
        }
      }
    });
    drone.on("lowBattery", (drone) => {
      let card = document.querySelector(`[data-droneid="${drone.id}"]`);
      card.querySelector(".droneCards__card__battery").classList.add("lowBattery");
      Notiflix.Notify.Warning(`Drone ${drone.id + 1} è quasi scarico`);
    });
    drone.on("extremeLowBattery", (drone) => {
      let card = document.querySelector(`[data-droneid="${drone.id}"]`);
      card.querySelector(".droneCards__card__battery").classList.add("extremeLowBattery");
      Notiflix.Notify.Failure(`Drone ${drone.id + 1} torna al takeOff`);
      drone.currentTarget = { n: "takeOff", target: state.takeOff };
      nextTarget(drone, state.takeOff);
    });
    drone.on("stop", (drone) => {
      drone.currentTarget = { n: "takeOff", target: state.takeOff };
      nextTarget(drone, state.takeOff);
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
    elements.play.classList.toggle("isPlay");
    state.drones.map((drone) => {
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
  elements.play.classList.toggle("isPlay");
  state.drones.map((drone) => {
    drone.currentTarget = { n: "takeOff", target: state.takeOff };
    nextTarget(drone);
  });
});

const toggleStep = (type) => {
  elements.missionStep[currentMissionStep].classList.toggle("active");
  elements.headerStep[currentMissionStep].classList.toggle("current");
  if (type === "next") elements.headerStep[currentMissionStep].classList.toggle("done");
  currentMissionStep =
    type === "next" ? currentMissionStep + 1 : type === "prev" ? currentMissionStep - 1 : 0;
  elements.missionStep[currentMissionStep].classList.toggle("active");
  if (elements.headerStep[currentMissionStep].classList.contains("done"))
    elements.headerStep[currentMissionStep].classList.toggle("done");
  elements.headerStep[currentMissionStep].classList.toggle("current");
  if (
    (type === "prev" || type === "reset") &&
    (currentMissionStep === 2 || currentMissionStep === 0)
  ) {
    const confirm = document.getElementById("confirm");
    if (confirm) {
      confirm.remove();
      elements.previousStep.insertAdjacentElement("afterend", elements.nextStep);
    }
  }
};

let currentMissionStep = undefined;
elements.creaMissione.addEventListener("click", (e) => {
  e.preventDefault();
  currentMissionStep = 0;
  elements.creaMissionePopup.style.display = "block";
});

elements.nextStep.addEventListener("click", (e) => {
  e.preventDefault();
  toggleStep("next");
  if (currentMissionStep === 3) {
    elements.nextStep.remove();
    elements.previousStep.insertAdjacentHTML("afterend", `<button id="confirm">Conferma</button>`);
    document.getElementById("confirm").addEventListener("click", (e) => {
      e.preventDefault();
      currentMissionStep = undefined;
      elements.creaMissionePopup.style.display = "none";
    });
  }
});

elements.previousStep.addEventListener("click", (e) => {
  e.preventDefault();
  toggleStep("prev");
});

elements.reset.addEventListener("click", (e) => {
  e.preventDefault();

  toggleStep("reset");
});
