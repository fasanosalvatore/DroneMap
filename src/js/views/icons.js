import L from "leaflet";

export const droneIcon = new L.Icon({
  iconUrl: require("svg-url-loader!./assets/droneIcon.svg"),
  iconRetinaUrl: require("svg-url-loader!./assets/droneIcon.svg"),
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(60, 60)
  //className: "leaflet-div-icon"
});

export const targetIcon = new L.Icon({
  iconUrl: require("svg-url-loader!./assets/targetIcon.svg"),
  iconRetinaUrl: require("svg-url-loader!./assets/targetIcon.svg"),
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(60, 60)
  //className: "leaflet-div-icon"
});
