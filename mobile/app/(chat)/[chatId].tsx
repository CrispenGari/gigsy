import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useMeStore } from "@/src/store/meStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import HeaderBackButton from "@/src/components/HeaderBackButton/HeaderBackButton";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "@/convex/_generated/api";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useQuery, useMutation } from "convex/react";
import Animated from "react-native-reanimated";
import ContentLoader from "@/src/components/ContentLoader/ContentLoader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import JobDetailsBottomSheet from "@/src/components/BottomSheets/JobDetailsBottomSheet";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const Page = () => {
  const { me } = useMeStore();
  const { chatId } = useLocalSearchParams<{ chatId: Id<"chats"> }>();
  const user = useQuery(api.api.user.get, { id: me?.id || "" });
  const chat = useQuery(api.api.chat.getById, {
    _id: chatId!,
    userId: user?._id,
  });

  const deleteMutation = useMutation(api.api.chat.deleteChat);
  const [state, setState] = React.useState({ loading: false });
  const { settings } = useSettingsStore();

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
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <ChatHeader chat={chat as any} />,
        }}
      />
      <Spinner visible={state.loading} animation="fade" />
      <View style={{ flex: 1 }}>
        <Text>{chatId}</Text>
      </View>
    </>
  );
};

export default Page;

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
  job: any;
}

const ChatHeader = ({ chat }: { chat: TChat }) => {
  const [loaded, setLoaded] = React.useState(true);
  const { top } = useSafeAreaInsets();
  const { me } = useMeStore();
  const { settings } = useSettingsStore();
  const jobBottomSheet = React.useRef<BottomSheetModal>(null);
  const router = useRouter();

  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.white,
      }}
    >
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
          height: 85,
          gap: 10,
          paddingHorizontal: 15,
          paddingTop: 10,
        }}
      >
        {!!chat.jobId ? (
          <JobDetailsBottomSheet ref={jobBottomSheet} id={chat.jobId} />
        ) : null}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
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
              : `${chat.advertiser?.firstName} ${chat.advertiser?.lastName} Advertise this job.`}
            {" ● "}
            {dayjs(new Date(chat?.job?._creationTime)).fromNow()} ago
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {}}
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
