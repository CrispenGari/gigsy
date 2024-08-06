import {
  View,
  Text,
  Animated,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { COLORS, FONTS } from "@/src/constants";
import { useMeStore } from "@/src/store/meStore";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import JobDetailsBottomSheet from "../BottomSheets/JobDetailsBottomSheet";
import ContentLoader from "../ContentLoader/ContentLoader";
import HeaderBackButton from "../HeaderBackButton/HeaderBackButton";
import { TJob } from "@/convex/tables/job";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  MenuTriggerProps,
} from "react-native-popup-menu";
import ChatOptionsBottomSheet from "../BottomSheets/ChatOptionsBottomSheet";

type TUser = {
  _id: Id<"users">;
  _creationTime: number;
  verified?: boolean | undefined;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
} | null;
interface TChat {
  _id: Id<"chats">;
  _creationTime: number;
  userId: Id<"users">;
  jobId: Id<"jobs">;
  advertiserId: Id<"users">;
  jobTitle: string;
  lastMessage: {
    _id: Id<"messages">;
    _creationTime: number;
    image?: string | undefined;
    text?: string | undefined;
    audio?: string | undefined;
    chatId: Id<"chats">;
    senderId: Id<"users">;
    seen: boolean;
  } | null;
  unread: number;
  user: TUser;
  advertiser: TUser;
  job: TJob;
}

const ChatHeader = ({ chat }: { chat: TChat }) => {
  const [loaded, setLoaded] = React.useState(true);
  const { top } = useSafeAreaInsets();
  const { me } = useMeStore();
  const { settings } = useSettingsStore();
  const jobBottomSheet = React.useRef<BottomSheetModal>(null);
  const chatOptionsBottomSheet = React.useRef<BottomSheetModal>(null);
  const router = useRouter();

  return (
    <SafeAreaView style={{}}>
      <View
        style={{
          flexDirection: "row",
          top: Platform.select({
            ios: 0,
            android: top,
          }),
          paddingBottom: 14,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: COLORS.lightGray,
          gap: 10,
          paddingHorizontal: 15,
          paddingTop: 10,
          backgroundColor: COLORS.white,
          alignItems: "center",
        }}
      >
        {!!chat?.jobId ? (
          <JobDetailsBottomSheet ref={jobBottomSheet} id={chat.jobId} />
        ) : null}
        {!!chat?._id ? (
          <ChatOptionsBottomSheet _id={chat._id} ref={chatOptionsBottomSheet} />
        ) : null}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <HeaderBackButton title={""} />
          <ContentLoader
            style={{
              width: 35,
              height: 35,
              borderRadius: 35,
              display: loaded ? "none" : "flex",
              backgroundColor: COLORS.lightGray,
              overflow: "hidden",
            }}
          />
          <TouchableOpacity
            onPress={async () => {
              if (settings.haptics) {
                await onImpact();
              }
              router.navigate({
                pathname: "/(user)/[id]",
                params: {
                  id:
                    me?.id === chat?.user?.id ? chat.advertiserId : chat.userId,
                },
              });
            }}
          >
            <Animated.Image
              style={{
                width: 35,
                height: 35,
                borderRadius: 35,
                display: loaded ? "flex" : "none",
              }}
              source={{
                uri:
                  me?.id === chat?.user?.id
                    ? chat?.advertiser?.image
                    : chat?.user?.image,
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
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            jobBottomSheet.current?.present();
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 18,
            }}
          >
            {chat?.jobTitle || "Chat"}
          </Text>

          <Text
            style={{
              fontFamily: FONTS.regular,
              color: COLORS.gray,
            }}
            numberOfLines={1}
          >
            {chat?.advertiser?.id === me?.id
              ? "You Advertise this job."
              : `${chat?.advertiser?.firstName} ${chat?.advertiser?.lastName} Advertise this job.`}
            {" ● "}
            {dayjs(new Date(chat?.job?._creationTime)).fromNow()} ago
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            if (settings.haptics) {
              await onImpact();
            }
            chatOptionsBottomSheet.current?.present();
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 40,
            backgroundColor: COLORS.lightGray,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="ellipsis-vertical-outline"
            size={18}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatHeader;
