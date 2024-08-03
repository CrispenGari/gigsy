import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, IMAGES } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import Typography from "../Typography/Typography";
import { useMediaPermission } from "@/src/hooks";
import * as ImagePicker from "expo-image-picker";
import Animated from "react-native-reanimated";
import { sharedElementTransition } from "@/src/utils/SharedTransition";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import ContentLoader from "../ContentLoader/ContentLoader";

interface Props {
  uri?: string;
  setBase64: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setURI: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  sharedTransitionTag?: string;
  dimensions?: {
    width: number;
    height: number;
    borderRadius: number;
  };
  iconSize?: number;
}
const ProfileAvatar = ({
  uri,
  setBase64,
  sharedTransitionTag,
  dimensions,
  iconSize,
  setURI,
}: Props) => {
  const { camera, gallery } = useMediaPermission();
  const [image, setImage] = React.useState<{
    uri?: string;
    base64?: string | null;
  }>({ uri: uri, base64: null });
  const [loaded, setLoaded] = React.useState(true);
  const { dismiss } = useBottomSheetModal();
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ["32%"], []);
  const { settings } = useSettingsStore();
  const openPhotoOptions = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    bottomSheetModalRef.current?.present();
  };
  const select = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (gallery) {
      const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        aspect: [1, 1],
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.POPOVER,
        base64: true,
      });

      if (!canceled) {
        setImage((state) => ({
          ...state,
          uri: assets[0].uri,
          base64: assets[0].base64,
        }));
        const base64 = assets[0].base64;
        const mimeType = assets[0].mimeType;
        const img = `data:${mimeType};base64,${base64}`;
        setBase64(img);
        setURI(assets[0].uri);
      }
    }
    dismiss();
  };
  const take = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (camera) {
      const { assets, canceled } = await ImagePicker.launchCameraAsync({
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        aspect: [1, 1],
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.POPOVER,
        base64: true,
      });

      if (!canceled) {
        setImage((state) => ({
          ...state,
          uri: assets[0].uri,
          base64: assets[0].base64,
        }));
        const base64 = assets[0].base64;
        const mimeType = assets[0].mimeType;
        const img = `data:${mimeType};base64,${base64}`;
        setBase64(img);
        setURI(assets[0].uri);
      }
    }

    dismiss();
  };
  const remove = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    setImage((state) => ({
      ...state,
      uri: uri ? uri : undefined,
      base64: null,
    }));
    setBase64(null);
    dismiss();
  };

  React.useEffect(() => {
    if (!!image) {
      setLoaded(true);
    }
  }, [image]);

  return (
    <>
      <TouchableOpacity
        onPress={openPhotoOptions}
        activeOpacity={0.7}
        style={{ position: "relative" }}
      >
        {!loaded ? (
          <ContentLoader
            style={[
              {
                width: 250,
                height: 250,
                borderRadius: 250,
                display: loaded ? "none" : "flex",
                backgroundColor: COLORS.lightGray,
                overflow: "hidden",
              },
              dimensions ? dimensions : {},
            ]}
          />
        ) : null}
        <Animated.Image
          source={{
            uri: image.uri
              ? image.uri
              : uri || Image.resolveAssetSource(IMAGES.profile).uri,
          }}
          style={[
            {
              width: 250,
              height: 250,
              borderRadius: 250,
              display: loaded ? "flex" : "none",
            },
            dimensions ? dimensions : {},
          ]}
          sharedTransitionStyle={sharedElementTransition}
          sharedTransitionTag={sharedTransitionTag}
          onError={(_error) => {
            setLoaded(true);
          }}
          onLoadEnd={() => {
            setLoaded(true);
          }}
          onLoadStart={() => {
            setLoaded(false);
          }}
          onLoad={() => {
            setLoaded(true);
          }}
        />
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            position: "absolute",
            zIndex: 1,
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <TouchableOpacity
            onPress={openPhotoOptions}
            activeOpacity={0.7}
            style={{
              backgroundColor: COLORS.gray,
              justifyContent: "center",
              alignItems: "center",
              width: iconSize ? iconSize * 2 : 60,
              height: iconSize ? iconSize * 2 : 60,
              borderRadius: iconSize ? iconSize * 2 : 60,
              marginBottom: 10,
            }}
          >
            <Ionicons
              name="camera-outline"
              size={iconSize ? iconSize : 30}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: COLORS.white }}
        style={{ borderRadius: 0 }}
        handleComponent={() => (
          <View
            style={{
              borderRadius: 999,
              alignSelf: "center",
              width: 40,
              padding: 2,
              backgroundColor: COLORS.black,
              marginVertical: 10,
            }}
          />
        )}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetView
          style={{ flex: 1, padding: 10, backgroundColor: COLORS.white }}
        >
          <Typography
            variant="h6"
            style={{
              alignSelf: "center",
              marginBottom: 5,
              color: COLORS.black,
            }}
          >
            Set a profile avatar.
          </Typography>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 10,
              width: "100%",
              alignItems: "center",
              paddingVertical: 4,
            }}
            activeOpacity={0.7}
            onPress={take}
          >
            <View
              style={{
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                width: 50,
                height: 50,
                backgroundColor: COLORS.semiGray,
              }}
            >
              <Ionicons name="camera-outline" size={24} color={COLORS.black} />
            </View>
            <Typography
              style={{
                color: COLORS.black,
              }}
            >
              Take a photo
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 10,
              width: "100%",
              alignItems: "center",
              paddingVertical: 4,
            }}
            activeOpacity={0.7}
            onPress={select}
          >
            <View
              style={{
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                width: 50,
                height: 50,
                backgroundColor: COLORS.semiGray,
              }}
            >
              <Ionicons name="image-outline" size={24} color={COLORS.green} />
            </View>

            <Typography
              style={{
                color: COLORS.black,
              }}
            >
              Select a photo
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 10,
              width: "100%",
              alignItems: "center",
              paddingVertical: 4,
            }}
            activeOpacity={0.7}
            onPress={remove}
          >
            <View
              style={{
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                width: 50,
                height: 50,
                backgroundColor: COLORS.semiGray,
              }}
            >
              <Ionicons name="close-outline" size={24} color={COLORS.red} />
            </View>
            <Typography
              style={{
                color: COLORS.black,
              }}
            >
              Remove a photo
            </Typography>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default ProfileAvatar;
