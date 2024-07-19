module.exports = {
  expo: {
    name: "gigsy",
    slug: "gigsy",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/preset.png",
    scheme: "gigsy",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#ffffff",
      },
      package: "com.crispengari.gigsy",
    },
    web: {
      bundler: "metro",
      output: "server",
      favicon: "./assets/images/logo.png",
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
      [
        "expo-dynamic-app-icon",
        {
          danger: {
            image: "./assets/images/danger.png", // icon path
            prerendered: true, // for ios UIPrerenderedIcon option
          },
          dark: {
            image: "./assets/images/dark.png",
            prerendered: true,
          },
          preset: {
            image: "./assets/images/preset.png",
            prerendered: true,
          },
          gray: {
            image: "./assets/images/gray.png",
            prerendered: true,
          },
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
