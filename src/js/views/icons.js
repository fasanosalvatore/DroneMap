import L from "leaflet";
import droneI from "../../img/droneIcon.svg";
import droneID from "../../img/droneIconDark.svg";
import targetI from "../../img/targetIcon.svg";

export const droneIcon = new L.Icon({
  iconUrl: droneI,
  iconRetinaUrl: droneI,
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(60, 60)
  //className: "leaflet-div-icon"
});

export const droneIconDark = new L.Icon({
  iconUrl: droneID,
  iconRetinaUrl: droneID,
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(60, 60)
  //className: "leaflet-div-icon"
});

export const targetIcon = new L.Icon({
  iconUrl: targetI,
  iconRetinaUrl: targetI,
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(60, 60)
  //className: "leaflet-div-icon"
});
