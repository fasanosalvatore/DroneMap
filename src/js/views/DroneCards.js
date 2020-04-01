import { elements } from "./base";
import AttitudeIndicator from "../models/AttitudeIndicator";

export const createCards = drones => {
  let cards = "";
  drones.map(
    drone =>
      (cards += `
    <div class="droneCards__card" data-droneid="${drone.id}">
      <div class="droneCards__card__titleBar">
        <h3>#${drone.id} Drone</h3>
        <div class="droneCards__card__commands">
          <button id="stopSingleDrone">
            <svg width="8" height="8" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" fill="none" fill-rule="evenodd"><circle stroke="#979797" cx="3" cy="3" r="3"/><path fill="#D8D8D8" d="M2 2h2v2H2z"/></g></svg>
          </button>
          <button id ="attitudeIndicatorOpen">
            <svg width="8" height="8" preserveAspectRatio="xMidYMid meet" viewbox="0 0 40 34"  fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36.908 3.131H3.092A3.096 3.096 0 000 6.223v27.554a3.096 3.096 0 003.092 3.092h33.816A3.096 3.096 0 0040 33.777V6.223a3.096 3.096 0 00-3.092-3.092zm1.918 30.646a1.92 1.92 0 01-1.918 1.918H3.092a1.92 1.92 0 01-1.918-1.918V6.223a1.92 1.92 0 011.918-1.917h33.816a1.92 1.92 0 011.918 1.917v27.554z" fill="#F4F5F7"/><path d="M8.102 9.394c-1.015 0-1.84.825-1.84 1.84 0 1.013.825 1.839 1.84 1.839 1.014 0 1.84-.826 1.84-1.84 0-1.014-.826-1.84-1.84-1.84zm0 2.504a.666.666 0 11.001-1.332.666.666 0 01-.001 1.332z" fill="#F4F5F7"/><path d="M9.354 6.889h-5.01a.587.587 0 00-.587.587v5.01a.587.587 0 101.174 0V8.063h4.423a.587.587 0 000-1.174zM35.656 6.889h-5.01a.587.587 0 000 1.174h4.422v4.422a.587.587 0 101.175 0v-5.01a.587.587 0 00-.587-.586zM9.354 31.938H4.931v-4.423a.587.587 0 00-1.174 0v5.01c0 .324.263.587.587.587h5.01a.587.587 0 000-1.175zM35.656 26.928a.587.587 0 00-.588.587v4.422h-4.422a.587.587 0 000 1.175h5.01a.587.587 0 00.587-.587v-5.01a.587.587 0 00-.587-.587zM11.86 10.568h6.261a.587.587 0 100-1.174H11.86a.587.587 0 100 1.174zM13.738 11.898h-1.879a.587.587 0 100 1.175h1.879a.587.587 0 100-1.175z" fill="#F4F5F7"/><path d="M33.15 30.607a.587.587 0 000-1.174h-1.252a.587.587 0 000 1.174h1.253zM29.393 29.433h-3.757a.587.587 0 000 1.174h3.757a.587.587 0 000-1.174zM23.131 19.413h-2.544V16.87a.587.587 0 10-1.174 0v2.544h-2.544a.587.587 0 000 1.174h2.544v2.544a.587.587 0 101.174 0v-2.544h2.544a.587.587 0 000-1.174z" fill="#F4F5F7"/></svg>
          </button>
          <div class="droneCards__card__battery">${drone.getBattery()}%</div>
        </div>
      </div>
      <p>Pronto alla partenza</p>
      <div class="droneCards__card__latlng">
        <p><span class="droneCards__card__title">Lat</span><span class="coords">${
          drone.marker.getLatLng().lat
        }</span></p>
        <p><span class="droneCards__card__title">Lng</span><span class="coords">${
          drone.marker.getLatLng().lng
        }</span></p>
      </div>
    </div>
  `)
  );
  const markup = `
    <div class="droneCards">
      <h1>${drones.length} droni attivi!</h1>
      <div class="droneCards__container">
        ${cards}
      </div>
    </div>
  `;
  elements.map.insertAdjacentHTML("beforeend", markup);

  const stopSingleDrone = drone => {
    drone.emit("stop", drone);
  };
  document.querySelectorAll("#stopSingleDrone").forEach(s => {
    s.addEventListener("click", e => {
      const clickedDrone =
        drones[
          e.target.closest("#stopSingleDrone").parentNode.parentNode.parentNode.dataset.droneid
        ];
      stopSingleDrone(clickedDrone);
    });
  });

  const addAttitudeIndicator = drone => {
    elements.attitudeIndicator.setAttribute("data-drone", drone.id);
    drone.attitudeIndicator = new AttitudeIndicator("#attitudeIndicator", {
      size: 200,
      pitch: 0,
      roll: 0,
      showBox: false
    });
    var increment = 0;
    elements.currentUpdateInterval = setInterval(function() {
      drone.attitudeIndicator.setRoll(30 * Math.sin(increment / 10));
      drone.attitudeIndicator.setPitch(50 * Math.sin(increment / 20));
      increment++;
    }, 50);
  };

  document.querySelectorAll("#attitudeIndicatorOpen").forEach(s => {
    s.addEventListener("click", e => {
      const id = e.target.closest("#attitudeIndicatorOpen").parentNode.parentNode.parentNode.dataset
        .droneid;
      const clickedDrone = drones[id];
      if (!elements.attitudeIndicator.classList.contains("open")) {
        addAttitudeIndicator(clickedDrone);
        elements.attitudeIndicator.classList.toggle("open");
      } else {
        const oldId = elements.attitudeIndicator.dataset.drone;
        clearInterval(elements.currentUpdateInterval);
        elements.attitudeIndicator.removeAttribute("data-drone");
        elements.attitudeIndicator.innerHTML = "";
        console.log(id !== oldId);
        if (id !== oldId) addAttitudeIndicator(clickedDrone);
        else elements.attitudeIndicator.classList.toggle("open");
      }
    });
  });
};

export const updateCard = (latlng, drone) => {
  let card = document.querySelector(`[data-droneid="${drone.id}"]`);
  let battery = card.querySelector(".droneCards__card__battery");
  battery.textContent = drone.getBattery() + "%";
  let p = card.querySelectorAll("p");
  if (drone.getBattery() > 0) p[0].textContent = `Si dirige al target ${drone.currentTarget}`;
  else if (drone.getBattery() <= 0) p[0].textContent = `È atterrato`;
  let coords = card.querySelectorAll(".coords");
  coords[0].textContent = latlng.lat;
  coords[1].textContent = latlng.lng;
};
