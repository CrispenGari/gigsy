import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { COLORS, FONTS } from "@/src/constants";
import { Id } from "@/convex/_generated/dataModel";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
const ChatOptionsBottomSheet = React.forwardRef<
  BottomSheetModal,
  { _id: Id<"chats"> }
>(({ _id }, ref) => {
  const { dismiss } = useBottomSheetModal();
  const snapPoints = React.useMemo(
    () => [Platform.select({ ios: "30%", android: "25%" }) || "25%"],
    []
  );
  const endChatMutation = useMutation(api.api.chat.endChat);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { settings } = useSettingsStore();
  const endChat = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    setLoading(true);
    await endChatMutation({ _id });
    setLoading(false);
    dismiss();
    router.back();
  };

  const blockUser = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };

  const report = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };

  const clearChat = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };
  return (
    <>
      <Spinner visible={loading} animation="fade" />
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={true}
        enableOverDrag={false}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <BottomSheetView
            style={{
              padding: 10,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity onPress={clearChat} style={styles.btn}>
              <MaterialIcons name="clear-all" size={18} color={COLORS.black} />
              <Text style={[styles.btnText]}>Clear Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={endChat} style={styles.btn}>
              <MaterialCommunityIcons
                name="chat-remove-outline"
                size={18}
                color={COLORS.black}
              />
              <Text style={[styles.btnText]}>End Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={report} style={styles.btn}>
              <MaterialIcons
                name="report-gmailerrorred"
                size={18}
                color={COLORS.red}
              />
              <Text style={[styles.btnText, { color: COLORS.red }]}>
                Report User
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={blockUser} style={styles.btn}>
              <MaterialIcons name="block" size={18} color={COLORS.red} />
              <Text style={[styles.btnText, { color: COLORS.red }]}>
                Block User
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
});

export default ChatOptionsBottomSheet;

const styles = StyleSheet.create({
  btn: {
    gap: 10,
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },
  btnText: {
    fontFamily: FONTS.bold,
  },
});
