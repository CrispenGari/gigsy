import * as SecureStore from "expo-secure-store";
import * as Sharing from "expo-sharing";
import mime from "mime";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";

export const onImpact = async () =>
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
export const getMimeType = (url: string) => mime.getType(url) || undefined;
export const downloadMedia = async (url: string) => {
  const fileName = mime.getExtension(getMimeType(url)!) || "fileName-img.jpg";
  const downloadPath = FileSystem.cacheDirectory + fileName;
  const { uri } = await FileSystem.downloadAsync(url, downloadPath);

  return {
    uri,
  };
};
export const shareSomething = async (url: string, dialogTitle: string) => {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) return;
  const { uri } = await downloadMedia(url);
  await Sharing.shareAsync(uri, {
    dialogTitle,
    UTI: getMimeType(url),
    mimeType: getMimeType(url),
  });
};

export const saveImageToLibrary = async (url: string) => {
  const isAvailable = await MediaLibrary.isAvailableAsync();
  if (!isAvailable) return;
  const { uri } = await downloadMedia(url);
  await MediaLibrary.saveToLibraryAsync(uri).then(() =>
    Alert.alert("Image Saved", "The profile image was saved to library.")
  );
};
export const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
