import { getDistance, convertDistance } from "geolib";
export type TCoord = {
  latitude: number;
  longitude: number;
};
export const calculateDistance = (
  me: TCoord,
  other: TCoord,
  metric: "km" | "mi" | "m" = "km"
) => {
  const distance = getDistance(me, other);
  if (metric === "m") return `${distance.toFixed(1)} m`;
  return `${convertDistance(distance, metric).toFixed(1)} ${metric}`;
};

export const convertSelectedDistance = (
  distance: number,
  metric: "km" | "mi" | "m" = "km"
) => `${convertDistance(distance, metric).toFixed(1)} ${metric}`;
