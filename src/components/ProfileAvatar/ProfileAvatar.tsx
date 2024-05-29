import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import React from "react";
import { COLORS, IMAGES } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import Typography from "../Typography/Typography";
import { useMediaPermission } from "@/src/hooks";
import * as ImagePicker from "expo-image-picker";

interface Props {
  uri?: string;
  setBase64: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}
const ProfileAvatar = ({ uri, setBase64 }: Props) => {
  const { camera, gallery } = useMediaPermission();
  const [image, setImage] = React.useState<{
    uri?: string;
    base64?: string | null;
  }>({ uri: uri, base64: null });

  const { dismiss } = useBottomSheetModal();
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ["32%"], []);
  const openPhotoOptions = () => bottomSheetModalRef.current?.present();
  const select = async () => {
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
        setBase64(assets[0].base64);
      }
    }
    dismiss();
  };
  const take = async () => {
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
        setBase64(assets[0].base64);
      }
    }

    dismiss();
  };
  const remove = () => {
    setImage((state) => ({
      ...state,
      uri: uri ? uri : undefined,
      base64: null,
    }));
    setBase64(null);
    dismiss();
  };

  return (
    <>
      <TouchableOpacity
        onPress={openPhotoOptions}
        activeOpacity={0.7}
        style={{ position: "relative" }}
      >
        <Image
          source={{
            uri: image.uri
              ? image.uri
              : Image.resolveAssetSource(IMAGES.profile).uri,
          }}
          style={{
            width: 250,
            height: 250,
            borderRadius: 250,
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
              backgroundColor: COLORS.common.white,
              justifyContent: "center",
              alignItems: "center",
              width: 60,
              height: 60,
              borderRadius: 60,
              marginBottom: 10,
            }}
          >
            <Ionicons name="camera-outline" size={35} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: COLORS.dark.main }}
        style={{ borderRadius: 0 }}
        handleComponent={() => (
          <View
            style={{
              borderRadius: 999,
              alignSelf: "center",
              width: 40,
              padding: 2,
              backgroundColor: COLORS.common.white,
              marginVertical: 10,
            }}
          />
        )}
      >
        <BottomSheetView style={{ flex: 1, padding: 10 }}>
          <Typography
            variant="h6"
            style={{
              alignSelf: "center",
              marginBottom: 5,
              color: COLORS.common.white,
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
                backgroundColor: COLORS.dark.main,
              }}
            >
              <Ionicons
                name="camera-outline"
                size={24}
                color={COLORS.common.white}
              />
            </View>

            <Typography
              style={{
                color: COLORS.common.white,
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
                backgroundColor: COLORS.dark.main,
              }}
            >
              <Ionicons
                name="image-outline"
                size={24}
                color={COLORS.common.green}
              />
            </View>

            <Typography
              style={{
                color: COLORS.common.white,
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
                backgroundColor: COLORS.dark.main,
              }}
            >
              <Ionicons
                name="close-outline"
                size={24}
                color={COLORS.common.red}
              />
            </View>
            <Typography
              style={{
                color: COLORS.common.white,
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
