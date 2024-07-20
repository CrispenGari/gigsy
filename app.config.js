module.exports = {
  expo: {
    name: "gigsy",
    slug: "gigsy",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "gigsy",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.crispengari.gigsy",
    },
    web: {
      bundler: "metro",
      output: "server",
      favicon: "./assets/images/icon.png",
    },
    plugins: [
      ["expo-router", { origin: "http://localhost:8081" }],
      "expo-font",
      "expo-secure-store",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },
    extra: {
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      eas: {
        projectId: "aa2944f5-70d2-4e12-9e1c-deff6646408d",
      },
    },
  },
};
