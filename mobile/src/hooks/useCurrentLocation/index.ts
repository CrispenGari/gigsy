import React from "react";
import { useLocationPermission } from "../";
import * as Location from "expo-location";
import { getLocationAddress } from "@/src/utils/address";
import { useSettingsStore } from "@/src/store/settingsStore";

type StateType = {
  lat: number;
  lon: number;
  address: {
    city: string | null;
    country: string | null;
    district: string | null;
    isoCountryCode: string | null;
    name: string | null;
    postalCode: string | null;
    region: string | null;
    street: string | null;
    streetNumber: string | null;
  };
};
export const useCurrentLocation = () => {
  const { granted } = useLocationPermission();
  const {
    settings: { location },
  } = useSettingsStore();
  const [state, setState] = React.useState<StateType>({
    lat: 51.507351,
    lon: -0.127758,
    address: {
      city: null,
      country: null,
      district: null,
      isoCountryCode: null,
      name: null,
      postalCode: null,
      region: null,
      street: null,
      streetNumber: null,
    },
  });

  React.useEffect(() => {
    (async () => {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: location.locationAccuracy,
      });
      if (coords) {
        setState((s) => ({
          ...s,
          lat: coords.latitude,
          lon: coords.longitude,
        }));
      }
      const address = await getLocationAddress({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setState((s) => ({
        ...s,
        lat: coords.latitude,
        lon: coords.longitude,
        address,
      }));
    })();
  }, [granted, location]);

  return state;
};
