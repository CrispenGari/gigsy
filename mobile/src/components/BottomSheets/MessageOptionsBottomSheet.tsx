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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { api } from "@/convex/_generated/api";
import { useMeStore } from "@/src/store/meStore";
import { useMutation, useQuery } from "convex/react";
const MessageOptionsBottomSheet = React.forwardRef<
  BottomSheetModal,
  { _id: Id<"messages"> }
>(({ _id }, ref) => {
  const reactToMessageMutation = useMutation(api.api.message.react);
  const deleteForEveryoneMutation = useMutation(
    api.api.message.deletedForEveryone
  );
  const deleteForMeMutation = useMutation(api.api.message.deletedForMe);
  const message = useQuery(api.api.message.get, { _id });
  const { me } = useMeStore();
  const { dismiss } = useBottomSheetModal();
  const isMine = me?.id === message?.sender?.id;
  const snapPoints = React.useMemo(
    () => [Platform.select({ ios: "25%", android: "20%" }) || "20%"],
    []
  );
  const { settings } = useSettingsStore();
  const deleteForMe = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!me || !!!message) {
      dismiss();
      return;
    }
    await deleteForMeMutation({ _id: message._id, id: me.id });
    dismiss();
  };
  const react = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!message) return;
    await reactToMessageMutation({ _id: message._id });

    dismiss();
  };
  const deleteForEveryone = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!me || !!!message) {
      dismiss();
      return;
    }
    await deleteForEveryoneMutation({ _id: message._id, id: me.id });
    dismiss();
  };

  return (
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
          <TouchableOpacity
            onPress={react}
            style={styles.btn}
            disabled={isMine}
          >
            <Ionicons
              name={message?.liked ? "heart" : "heart-outline"}
              size={18}
              color={
                isMine
                  ? COLORS.gray
                  : message?.liked
                    ? COLORS.red
                    : COLORS.black
              }
            />
            <Text
              style={[
                styles.btnText,
                {
                  color: isMine ? COLORS.gray : COLORS.black,
                },
              ]}
            >
              {message?.liked ? "Unlike" : "Like"} message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteForMe}
            style={styles.btn}
            disabled={!isMine}
          >
            <MaterialIcons
              name="delete-outline"
              size={18}
              color={isMine ? COLORS.red : COLORS.gray}
            />
            <Text
              style={[
                styles.btnText,
                { color: isMine ? COLORS.red : COLORS.gray },
              ]}
            >
              Delete for me
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteForEveryone}
            style={styles.btn}
            disabled={!isMine}
          >
            <MaterialIcons
              name="delete-sweep"
              size={18}
              color={isMine ? COLORS.red : COLORS.gray}
            />
            <Text
              style={[
                styles.btnText,
                { color: isMine ? COLORS.red : COLORS.gray },
              ]}
            >
              Delete for everyone
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default MessageOptionsBottomSheet;

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
