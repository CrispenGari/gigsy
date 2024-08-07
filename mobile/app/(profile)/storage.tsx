import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import { onImpact } from "@/src/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { useSettingsStore } from "@/src/store/settingsStore";
import Card from "@/src/components/Card/Card";
import * as Network from "expo-network";
import { useWishlistStore } from "@/src/store/wishlistStore";
import { useMeStore } from "@/src/store/meStore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Spinner from "react-native-loading-spinner-overlay";

const Page = () => {
  const router = useRouter();
  const { me } = useMeStore();
  const { settings, update } = useSettingsStore();
  const { clear, wishlists } = useWishlistStore();
  const [status, setStatus] = React.useState<Network.NetworkState>({
    isConnected: false,
    isInternetReachable: false,
    type: Network.NetworkStateType.NONE,
  });
  const clearAllMutation = useMutation(api.api.wishlist.clear);
  const [state, setState] = React.useState({
    loading: false,
  });
  const clearAll = async () => {
    if (!!!me) return;
    setState((s) => ({ ...s, loading: true }));
    const success = await clearAllMutation({ id: me.id });
    if (success) {
      clear();
    }
    setState((s) => ({ ...s, loading: false }));
  };

  React.useEffect(() => {
    Network.getNetworkStateAsync().then((value) => setStatus(value));
  }, []);
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Storage and Network",
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
      <Spinner visible={state.loading} animation="fade" />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          Storage Settings
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card
            style={{
              padding: 10,
              maxWidth: 500,
              alignSelf: "flex-start",
              borderRadius: 5,
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                update({
                  ...settings,
                  storage: {
                    ...settings.storage,
                    wishlists: !settings.storage.wishlists,
                  },
                });
              }}
            >
              <MaterialIcons name={"storage"} size={24} color={COLORS.gray} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Store Wishlists in Storage
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                  }}
                >
                  {settings.notifications.messages ? "Enabled" : "Disabled"}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        </Animated.View>

        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          Network Status
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card
            style={{
              padding: 10,
              maxWidth: 500,
              alignSelf: "flex-start",
              borderRadius: 5,
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 5,
              }}
            >
              <MaterialIcons
                name={status.isConnected ? "wifi" : "wifi-off"}
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Connected
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                  }}
                >
                  {status.isConnected ? "Yes" : "No"}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 5,
              }}
            >
              <MaterialIcons
                name={
                  status.isInternetReachable
                    ? "signal-cellular-4-bar"
                    : "signal-cellular-connected-no-internet-0-bar"
                }
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Internet Reachable
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                  }}
                >
                  {status.isInternetReachable ? "Yes" : "No"}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 5,
              }}
            >
              <MaterialIcons
                name={"perm-data-setting"}
                size={24}
                color={COLORS.gray}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Connection Type
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                    textTransform: "capitalize",
                  }}
                >
                  {status.type}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          Manage Storage
        </Text>
        <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
          <Card
            style={{
              padding: 10,
              maxWidth: 500,
              alignSelf: "flex-start",
              borderRadius: 5,
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
              onPress={async () => {
                if (settings.haptics) {
                  await onImpact();
                }
                clearAll;
              }}
            >
              <MaterialIcons name={"clear-all"} size={24} color={COLORS.gray} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, flexShrink: 18 }}>
                  Clear Wishlists
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    color: COLORS.gray,
                    fontSize: 12,
                  }}
                >
                  {wishlists.length} items.
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        </Animated.View>
      </View>
    </>
  );
};

export default Page;
