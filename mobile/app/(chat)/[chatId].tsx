import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useMeStore } from "@/src/store/meStore";
import { Stack, useLocalSearchParams } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import { WebView } from "react-native-webview";
import { COLORS, FONTS, relativeTimeObject, WALLPAPERS } from "@/src/constants";

import { api } from "@/convex/_generated/api";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import Animated from "react-native-reanimated";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { Ionicons } from "@expo/vector-icons";
import ChatHeader from "@/src/components/ChatHeader/ChatHeader";
import { KeyboardAvoidingView } from "react-native";
import MessageInput, {
  TAttachment,
} from "@/src/components/MessageInput/MessageInput";
import { useMutation as useMutationReactQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { runSendMessageWithUpload } from "@/src/utils/react-query";
import Message from "@/src/components/Message/Message";
import { useMediaQuery } from "@/src/hooks";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import WhatIsEnd2EndEncryptionBottomSheet from "@/src/components/BottomSheets/WhatIsEnd2EndEncryptionBottomSheet";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
const PAGE_SIZE = 30;
const Page = () => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const end2EndEncryptionRef = React.useRef<BottomSheetModal>(null);
  const {
    dimension: { width },
  } = useMediaQuery();
  const { me } = useMeStore();
  const { chatId } = useLocalSearchParams<{ chatId: Id<"chats"> }>();
  const readMessagesMutation = useMutation(api.api.message.readMessages);
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.api.message.chatMessages,
    {
      chatId: chatId,
    },
    { initialNumItems: PAGE_SIZE }
  );

  const user = useQuery(api.api.user.get, { id: me?.id || "" });
  const chat = useQuery(api.api.chat.getById, {
    _id: chatId!,
    userId: user?._id,
  });
  const { mutateAsync, isPending } = useMutationReactQuery({
    mutationFn: runSendMessageWithUpload,
    mutationKey: ["send-message"],
  });
  const deleteMutation = useMutation(api.api.chat.deleteChat);
  const [state, setState] = React.useState({ loading: false });
  const { settings } = useSettingsStore();
  const [attachment, setAttachment] = React.useState<TAttachment>();
  const sendMessageMutation = useMutation(api.api.message.send);

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

  const sendMessage = async (message: string) => {
    if (!!!user || !!!chat) return;
    setState((s) => ({ ...s, loading: true }));
    if (!!attachment) {
      const response = await fetch(attachment.uri);
      const blob = await response.blob();
      const _id = await mutateAsync({
        attachment: blob,
        chatId: chat._id,
        senderId: user._id,
        type: attachment.type,
        text: message,
      });
      setState((s) => ({ ...s, loading: false }));
      setAttachment(undefined);
      Keyboard.dismiss();
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } else {
      if (!!!message) return setState((s) => ({ ...s, loading: false }));
      const _id = await sendMessageMutation({
        chatId: chat._id,
        senderId: user._id,
        text: message,
        seen: false,
      });
      setState((s) => ({ ...s, loading: false }));
      Keyboard.dismiss();
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  React.useLayoutEffect(() => {
    if (!isLoading) scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [isLoading]);

  React.useEffect(() => {
    if (!!me && !!chatId) {
      readMessagesMutation({ id: me.id, chatId });
    }
  }, [chatId, me]);
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <ChatHeader chat={chat as any} />,
        }}
      />
      <WhatIsEnd2EndEncryptionBottomSheet ref={end2EndEncryptionRef} />

      <ImageBackground
        source={
          settings.wallpaper
            ? WALLPAPERS[settings.wallpaper]
            : WALLPAPERS.primary
        }
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          contentContainerStyle={{
            padding: 10,
            paddingTop: Platform.select({
              ios: 10,
              android: 40,
            }),
            paddingBottom: 10,
            flexDirection: "column-reverse",
          }}
          showsVerticalScrollIndicator={false}
        >
          {results.map((_id) => (
            <Message key={_id} _id={_id} />
          ))}

          {status === "LoadingMore" || status === "LoadingFirstPage" ? (
            <ActivityIndicator
              size={20}
              style={{
                alignSelf: "center",
              }}
            />
          ) : null}
          {status === "CanLoadMore" ? (
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginBottom: 10,
                backgroundColor: COLORS.white,
                borderRadius: 30,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: COLORS.lightGray,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                loadMore(PAGE_SIZE);
              }}
            >
              <Ionicons name="refresh-outline" size={15} color={COLORS.gray} />
            </TouchableOpacity>
          ) : null}

          <Text
            style={{
              fontFamily: FONTS.bold,
              alignSelf: "center",
              marginBottom: 10,
              backgroundColor: COLORS.white,
              padding: 10,
              borderRadius: 999,
              paddingVertical: 5,
            }}
          >
            Your messages are end-to-end encrypted.{" "}
            <Text
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                end2EndEncryptionRef.current?.present();
              }}
              style={{
                color: COLORS.green,
                textDecorationLine: "underline",
              }}
            >
              Learn more?
            </Text>
          </Text>
        </ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={width >= 600 ? 90 : 80}
        >
          {attachment ? (
            <Attachment
              attachment={attachment}
              onRemove={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                setAttachment(undefined);
              }}
            />
          ) : null}
          <MessageInput
            onShouldSend={(value) => {
              sendMessage(value);
            }}
            onNewAttachment={(attachment) => setAttachment(attachment)}
            sending={state.loading || isPending}
          />
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
};

export default Page;

const Attachment = ({
  attachment,
  onRemove,
}: {
  attachment: TAttachment;
  onRemove: () => void;
}) => {
  return (
    <BlurView
      intensity={80}
      style={{
        padding: 5,
        backgroundColor: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
        maxWidth: 210,
        alignSelf: "center",
        borderRadius: 10,
      }}
    >
      <TouchableOpacity
        style={{
          width: 20,
          height: 20,
          borderRadius: 20,
          backgroundColor: COLORS.red,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
          alignSelf: "flex-end",
        }}
        onPress={onRemove}
      >
        <Ionicons name="close-outline" size={16} color={COLORS.white} />
      </TouchableOpacity>
      {attachment.type === "image" ? (
        <Animated.Image
          source={{ uri: attachment.uri }}
          style={{ width: 200, height: 200 }}
        />
      ) : attachment.type === "document" ? (
        <WebView
          originWhitelist={["*"]}
          style={{ width: 200, height: 200 }}
          source={{ uri: attachment.uri }}
        />
      ) : (
        <Text>Audio not supported for now.</Text>
      )}
    </BlurView>
  );
};
