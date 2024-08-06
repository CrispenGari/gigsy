import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
  FlatList,
} from "react-native";
import React from "react";
import { useSettingsStore } from "@/src/store/settingsStore";
import { COLORS, FONTS, IMAGES, WALLPAPERS } from "@/src/constants";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import Animated from "react-native-reanimated";
import Card from "@/src/components/Card/Card";

const messages = [
  "Hi, I saw your listing for a part-time cleaning job. Is it still available?",
  "Hello! Yes, the position is still open. Are you interested?",
  "Yes, I am. Can you tell me more about the duties and the hours?",
  "Of course. The job involves cleaning a small office space, including vacuuming, dusting, and taking out the trash. The hours are flexible, but we need someone for about 10 hours a week.",
  "That sounds good. What is the pay rate?",
  "We offer R150 per hour.",
  "Great! I'm available to start next week. When can we meet to discuss further?",
  "How about this Thursday at 10 AM at the office? I can give you a tour and go over the details.",
];

const Page = () => {
  const { settings, update } = useSettingsStore();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Chat Wallpaper",
          headerLargeTitle: false,
          headerLargeTitleShadowVisible: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{ width: 40 }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ),

          headerLargeTitleStyle: { fontFamily: FONTS.bold, fontSize: 25 },
          headerTitleStyle: { fontFamily: FONTS.bold },
        }}
      />
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={
            settings.wallpaper
              ? WALLPAPERS[settings.wallpaper]
              : WALLPAPERS.primary
          }
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            scrollEventThrottle={16}
            contentContainerStyle={{
              padding: 10,
              paddingTop: Platform.select({
                ios: 10,
                android: 40,
              }),
              paddingBottom: 10,
            }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => (
              <MessageSimulation
                key={index}
                message={message}
                isMe={index % 2 === 1}
                index={index}
              />
            ))}
          </ScrollView>
        </ImageBackground>

        <View style={{ paddingVertical: 20, backgroundColor: COLORS.white }}>
          <Text
            style={{
              fontFamily: FONTS.bold,
              marginLeft: 10,
              fontSize: 16,
            }}
          >
            Chat Wallpapers
          </Text>
          <FlatList
            data={Object.entries(WALLPAPERS)}
            keyExtractor={([key]) => key}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const [name, uri] = item;
              return (
                <TouchableOpacity
                  onPress={async () => {
                    if (settings.haptics) {
                      await onImpact();
                    }
                    update({ ...settings, wallpaper: name as any });
                  }}
                  style={{
                    borderRadius: 10,
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Animated.Image
                    source={uri}
                    style={{
                      width: 100,
                      height: 200,
                      borderRadius: 10,
                      borderWidth: 3,
                      borderColor:
                        settings.wallpaper === name
                          ? COLORS.green
                          : COLORS.transparent,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                    }}
                  >
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{
              gap: 10,
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          />
        </View>
      </View>
    </>
  );
};

export default Page;

const MessageSimulation = ({
  isMe,
  message,
  index,
}: {
  isMe: boolean;
  message: string;
  index: number;
}) => {
  return (
    <View
      style={{
        maxWidth: "80%",
        alignSelf: isMe ? "flex-end" : "flex-start",
        marginBottom: 2,
        minWidth: 100,
      }}
    >
      <Card
        style={{
          margin: 0,
          backgroundColor: isMe ? COLORS.green : COLORS.white,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.bold,
            color: isMe ? COLORS.white : COLORS.black,
            marginTop: 5,
          }}
        >
          {message}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 10,
            color: isMe ? COLORS.lightGray : COLORS.gray,
            alignSelf: "flex-end",
            marginTop: 2,
          }}
        >
          {10 - index}h ago
        </Text>

        {index % 3 == 0 ? (
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

      {isMe ? (
        <View style={{ alignSelf: "flex-end", marginRight: 5 }}>
          <Ionicons name="checkmark-done" size={10} color={COLORS.green} />
        </View>
      ) : null}
    </View>
  );
};
