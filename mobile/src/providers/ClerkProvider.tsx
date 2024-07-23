import React from "react";
import { ClerkProvider as Provider } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import { tokenCache } from "../utils";
const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider
      tokenCache={tokenCache}
      publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey}
    >
      {children}
    </Provider>
  );
};

export default ClerkProvider;
