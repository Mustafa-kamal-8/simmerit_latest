import { ExpoConfig, ConfigContext } from "expo/config";

const isDev = process.env.NODE_ENV === "development";

// const APP_NAME = isDev ? "Simmer It (Dev)" : "Simmer It";
// const PACKAGE_NAME = isDev ? "com.simmerit.dev" : "com.simmerit";

const APP_NAME = "Simmer It";
const PACKAGE_NAME = "com.simmerit";

const VERSION = "2.1.5";
const SLUG = "simmer-it";
const SCHEME = "simmer-it"; // This is the URL scheme used for deep linking
const PROJECT_ID = "3bf913b1-194d-44f5-8156-7d4975c58b48"; // arodos.tech Expo account
// const PROJECT_ID = "744ddce1-a32d-445a-819f-80b458b1aaf9"; // sazzadur Expo account

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: SLUG,
  scheme: SCHEME,
  version: VERSION,
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  updates: {
    url: `https://u.expo.dev/${PROJECT_ID}`,
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: PACKAGE_NAME,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    runtimeVersion: VERSION,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#37655f",
    },
    package: PACKAGE_NAME,
    intentFilters: [
      {
        action: "SEND",
        data: [{ mimeType: "text/plain" }, { mimeType: "image/*" }],
        category: ["DEFAULT"],
      },
      {
        action: "VIEW",
        data: {
          scheme: SCHEME,
        },
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
    runtimeVersion: VERSION,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    ["expo-video"],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#37655f",
      },
    ],
    [
      "expo-share-intent",
      {
        iosActivationRules: {
          NSExtensionActivationSupportsText: true,
          NSExtensionActivationSupportsWebURLWithMaxCount: 1,
          NSExtensionActivationSupportsWebPageWithMaxCount: 1,
          NSExtensionActivationSupportsImageWithMaxCount: 2,
        },
        androidIntentFilters: ["text/*", "image/*"],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: PROJECT_ID,
    },
  },
});
