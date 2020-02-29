import { elements } from "./base";

export const createCards = drones => {
  let cards = "";
  drones.map(
    drone =>
      (cards += `
    <div class="droneCards__card" data-droneid="${drone.id}">
      <p>${drone.marker.getLatLng().lat}</p>
      <p>${drone.marker.getLatLng().lng}</p>
      <p>${drone.getBattery()}</p>
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
};

export const updateCard = (latlng, drone) => {
  let card = document.querySelector(`[data-droneid="${drone.id}"]`);
  let p = card.querySelectorAll("p");
  p[0].textContent = latlng.lat;
  p[1].textContent = latlng.lng;
  p[2].textContent = drone.getBattery();
};
