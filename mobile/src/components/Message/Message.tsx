import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import Card from "../Card/Card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { Ionicons } from "@expo/vector-icons";
import { useMeStore } from "@/src/store/meStore";
import Animated from "react-native-reanimated";
import ContentLoader from "../ContentLoader/ContentLoader";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useRouter } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import MessageOptionsBottomSheet from "../BottomSheets/MessageOptionsBottomSheet";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Message = ({ _id }: { _id: Id<"messages"> }) => {
  const message = useQuery(api.api.message.get, { _id });
  const { me } = useMeStore();
  const [loaded, setLoaded] = React.useState(true);
  const { settings } = useSettingsStore();
  const router = useRouter();
  const messageOptionsRef = React.useRef<BottomSheetModal>(null);
  const reactToMessageMutation = useMutation(api.api.message.react);

  const react = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!message || !!!me || message.sender?.id === me.id) return;
    await reactToMessageMutation({ _id: message._id });
  };
  const tap = Gesture.Tap().numberOfTaps(2).onEnd(react);
  if (!!!message) return <SkeletonMessage />;

  if (message.deletedFor?.length === 1 && me?.id === message.sender?.id)
    return <MessageDeletedFor1 isMine />;
  if (message.deletedFor?.length && message.deletedFor.length > 1)
    return <MessageDeletedForEveryone isMine={me?.id === message.sender?.id} />;

  return (
    <>
      <MessageOptionsBottomSheet ref={messageOptionsRef} _id={message._id} />
      <GestureDetector gesture={tap}>
        <TouchableOpacity
          onLongPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            messageOptionsRef.current?.present();
          }}
          style={{
            maxWidth: "80%",
            alignSelf:
              me?.id === message.sender?.id ? "flex-end" : "flex-start",
            marginBottom: 2,
            minWidth: 100,
          }}
        >
          <Card
            style={{
              margin: 0,
              backgroundColor:
                me?.id === message.sender?.id ? COLORS.green : COLORS.white,
            }}
          >
            {message.image ? (
              <>
                <ContentLoader
                  style={{
                    display: loaded ? "none" : "flex",
                    backgroundColor: COLORS.lightGray,
                    overflow: "hidden",
                    width: 200,
                    height: 200,
                  }}
                />
                <TouchableOpacity
                  onPress={async () => {
                    if (settings.haptics) {
                      await onImpact();
                    }
                    router.navigate({
                      pathname: "/(chat)/viewer",
                      params: {
                        uri: message.image,
                      },
                    });
                  }}
                >
                  <Animated.Image
                    style={{
                      width: 200,
                      height: 200,
                      display: !loaded ? "none" : "flex",
                      borderRadius: 5,
                    }}
                    source={{ uri: message.image }}
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
                </TouchableOpacity>
              </>
            ) : null}
            <Text
              style={{
                fontFamily: FONTS.bold,
                color:
                  me?.id === message.sender?.id ? COLORS.white : COLORS.black,
                marginTop: 5,
              }}
            >
              {message.text}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: 10,
                color:
                  me?.id === message.sender?.id
                    ? COLORS.lightGray
                    : COLORS.gray,
                alignSelf: "flex-end",
                marginTop: 2,
              }}
            >
              {dayjs(new Date(message._creationTime)).fromNow()} ago
            </Text>
            {message.liked ? (
              <Ionicons
                name="heart"
                style={{
                  position: "absolute",
                  bottom: -5,
                  left: -5,
                }}
                size={18}
                color={COLORS.red}
              />
            ) : null}
          </Card>
          {me?.id === message.sender?.id ? (
            <View style={{ alignSelf: "flex-end", marginRight: 5 }}>
              <Ionicons
                name="checkmark-done"
                size={10}
                color={message.seen ? COLORS.green : COLORS.gray}
              />
            </View>
          ) : null}
        </TouchableOpacity>
      </GestureDetector>
    </>
  );
};

export default Message;

const SkeletonMessage = () => <View></View>;
const MessageDeletedFor1 = ({ isMine }: { isMine: boolean }) => {
  return null;
};
const MessageDeletedForEveryone = ({ isMine }: { isMine: boolean }) => {
  return (
    <View
      style={{
        maxWidth: "80%",
        alignSelf: isMine ? "flex-end" : "flex-start",
        marginBottom: 2,
        minWidth: 100,
        backgroundColor: isMine ? COLORS.green : COLORS.white,
        padding: 20,
        paddingVertical: 3,
        borderRadius: 999,
      }}
    >
      <Text style={{ fontFamily: FONTS.italic, color: COLORS.gray }}>
        This message was deleted
      </Text>
    </View>
  );
};
