import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import { setAppIcon } from "expo-dynamic-app-icon";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appIcons, COLORS, FONTS } from "@/src/constants";
import Animated, { SlideInLeft } from "react-native-reanimated";
import Card from "@/src/components/Card/Card";

const Page = () => {
  const { settings, update: updateSettings } = useSettingsStore();
  const router = useRouter();
  const icons = React.useMemo(() => appIcons, []);
  const [state, setState] = React.useState({
    icon: icons[0],
  });

  const update = async (icon: { name: string; path: any; id: string }) => {
    if (settings.haptics) {
      await onImpact();
    }
    setState((s) => ({ ...s, icon }));
    updateSettings({ ...settings, icon: icon.name as any });
    // setAppIcon(icon.name);
  };

  React.useEffect(() => {
    const icon = icons.find((icon) => icon.name === settings.icon);
    if (!!icon) setState((s) => ({ ...s, icon }));
  }, [settings]);
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "App Icon",
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
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          Change App Icon
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card
            style={{
              padding: 10,
              maxWidth: 400,
              borderRadius: 5,
              width: "100%",
              paddingVertical: 20,
              alignSelf: "center",
            }}
          >
            <FlatList
              data={icons}
              keyExtractor={({ id }) => id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                  }}
                  onPress={() => update(item)}
                >
                  <Image
                    source={item.path}
                    style={{ width: 50, height: 50, borderRadius: 15 }}
                  />
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      textTransform: "capitalize",
                      flex: 1,
                    }}
                  >
                    {item.name}
                  </Text>
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: COLORS.gray,
                      padding: 2,
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 15,
                        backgroundColor:
                          state.icon.id === item.id
                            ? COLORS.green
                            : COLORS.white,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          </Card>
        </Animated.View>
      </View>
    </>
  );
};

export default Page;
