import { elements } from "./base";

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
          <div class="droneCards__card__battery">${drone.getBattery()}%</div>
        </div>
      </div>
      <p>Pronto alla partenza</p>
      <div class="droneCards__card__latlng">
        <p><span class="droneCards__card__title">Lat</span><span class="coords">${drone.marker.getLatLng().lat}</span></p>
        <p><span class="droneCards__card__title">Lng</span><span class="coords">${drone.marker.getLatLng().lng}</span></p>
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

  const stopSingleDrone = (drone) => {
    drone.emit("stop", drone);
  }
  document.querySelectorAll("#stopSingleDrone").forEach(s => {
    s.addEventListener("click", (e) => {
      const clickedDrone = drones[e.target.closest('#stopSingleDrone').parentNode.parentNode.parentNode.dataset.droneid];
      stopSingleDrone(clickedDrone);
    })
  })
};

export const updateCard = (latlng, drone) => {
  let card = document.querySelector(`[data-droneid="${drone.id}"]`);
  let battery = card.querySelector(".droneCards__card__battery");
  battery.textContent = drone.getBattery() + '%';
  let p = card.querySelectorAll("p");
  p[0].textContent = `Si dirige al target ${drone.currentTarget}`;
  let coords = card.querySelectorAll(".coords");
  coords[0].textContent = latlng.lat;
  coords[1].textContent = latlng.lng;
};
