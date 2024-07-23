import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import React from "react";
import { usePlatform } from "../usePlatform";

export const useNotificationToken = () => {
  const { os } = usePlatform();
  const [token, setToken] = React.useState("");

  React.useEffect(() => {
    (async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        const { data } = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.projectId,
        });
        setToken(data);
      } else {
        alert("Must use physical device for Push Notifications");
      }
      if (os === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "notification.wav",
        });
      }
    })();
  }, [os]);

  return { token };
};
