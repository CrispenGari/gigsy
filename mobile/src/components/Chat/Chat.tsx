import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Spinner from "react-native-loading-spinner-overlay";
import { Swipeable } from "react-native-gesture-handler";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useMeStore } from "@/src/store/meStore";
import Animated from "react-native-reanimated";
import ContentLoader from "../ContentLoader/ContentLoader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Chat = ({ _id }: { _id: Id<"chats"> }) => {
  const { me } = useMeStore();
  const user = useQuery(api.api.user.get, { id: me?.id || "" });
  const chat = useQuery(api.api.chat.getById, { _id, userId: user?._id });

  const deleteMutation = useMutation(api.api.chat.deleteChat);
  const [state, setState] = React.useState({ loading: false });
  const { settings } = useSettingsStore();
  const [loaded, setLoaded] = React.useState(true);
  const deleteChat = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!chat?._id) return;
    setState({ loading: true });
    deleteMutation({ _id: chat._id }).finally(() => {
      setState({ loading: false });
    });
  };
  if (!!!chat) return <SkeletonChat />;
  return (
    <>
      <Spinner visible={state.loading} animation="fade" />
      <Swipeable
        overshootLeft={false}
        friction={3}
        overshootFriction={8}
        enableTrackpadTwoFingerGesture
        renderRightActions={(_progress, _dragX) => {
          return (
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                minWidth: 50,
                backgroundColor: COLORS.red,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}
              onPress={deleteChat}
            >
              <Ionicons name="trash-bin-outline" size={24} color="white" />
            </TouchableOpacity>
          );
        }}
        renderLeftActions={(_progress, _dragX) => {
          return (
            <Link
              href={{
                pathname: "/(chat)/[chatId]",
                params: {
                  chatId: chat._id,
                },
              }}
              asChild
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: 50,
                  backgroundColor: COLORS.green,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
              >
                <Text style={{ fontFamily: FONTS.bold, color: COLORS.white }}>
                  Open
                </Text>
              </TouchableOpacity>
            </Link>
          );
        }}
        containerStyle={{
          maxWidth: 500,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <Link
          href={{
            pathname: "/(chat)/[chatId]",
            params: {
              chatId: chat._id,
            },
          }}
          asChild
        >
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.white,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: COLORS.gray,
              maxWidth: 500,
              width: `100%`,
              flexDirection: "row",
              gap: 10,
              padding: 10,
              alignSelf: "center",
            }}
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
            }}
          >
            <ContentLoader
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                display: loaded ? "none" : "flex",
                backgroundColor: COLORS.lightGray,
                overflow: "hidden",
              }}
            />
            <Animated.Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                display: loaded ? "flex" : "none",
              }}
              source={{
                uri:
                  me?.id === chat.user?.id
                    ? chat.advertiser?.image
                    : chat.user?.image,
              }}
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
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 16 }}>
                {chat?.jobTitle}
              </Text>
              <Text
                style={{ fontFamily: FONTS.regular, color: COLORS.gray }}
                numberOfLines={1}
              >
                <Text style={{ fontFamily: FONTS.bold }}>
                  {chat.lastMessage?.senderId === user?._id
                    ? "Your turn  ●"
                    : ""}
                </Text>
                {dayjs(new Date(chat?.lastMessage?._creationTime!)).fromNow()}{" "}
                ago ●{" "}
                {chat.lastMessage?.text
                  ? chat.lastMessage.text
                  : chat.lastMessage?.image
                    ? "<Image>"
                    : chat.lastMessage?.audio
                      ? "<Audio>"
                      : "No messages in this chat."}
              </Text>
            </View>
            {!!chat.unread ? (
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: COLORS.green,
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontFamily: FONTS.bold, color: COLORS.white }}>
                  {chat.unread <= 9 ? chat.unread : "9+"}
                </Text>
              </View>
            ) : (
              <View />
            )}
          </TouchableOpacity>
        </Link>
      </Swipeable>
    </>
  );
};

export default Chat;

export const SkeletonChat = () => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.gray,
        maxWidth: 500,
        width: `100%`,
        flexDirection: "row",
        gap: 10,
        padding: 10,
        alignSelf: "center",
      }}
    >
      <ContentLoader
        style={{
          width: 40,
          height: 40,
          borderRadius: 40,
          backgroundColor: COLORS.lightGray,
          overflow: "hidden",
        }}
      />

      <View style={{ flex: 1 }}>
        <ContentLoader
          style={{
            width: "70%",
            height: 20,
            borderRadius: 10,
            marginBottom: 4,
          }}
        />
        <View style={{ flexDirection: "row", gap: 5 }}>
          <ContentLoader
            style={{
              width: 100,
              height: 10,
              borderRadius: 10,
              marginBottom: 4,
            }}
          />
          <ContentLoader
            style={{
              height: 10,
              borderRadius: 10,
              flex: 1,
            }}
          />
        </View>
      </View>
      <ContentLoader
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
        }}
      />
    </View>
  );
};
