import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Svg, Image as ImageSvg } from "react-native-svg";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFooter,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { COLORS, FONTS } from "@/src/constants";
import { usePlatform } from "@/src/hooks";
import { TLoc, useLocationStore } from "@/src/store/locationStore";
import MapView, {
  Callout,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import Animated, {
  interpolate,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useMeStore } from "@/src/store/meStore";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getLocationAddress } from "@/src/utils/address";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
interface LocationPickerBottomSheetProps {
  onChangeValue: (value: TLoc) => void;
  initialState: TLoc;
}
const LocationPickerBottomSheet = React.forwardRef<
  BottomSheetModal,
  LocationPickerBottomSheetProps
>(({ onChangeValue, initialState }, ref) => {
  const { location } = useLocationStore();
  const { os } = usePlatform();
  const { me } = useMeStore();
  const { dismiss } = useBottomSheetModal();
  const { bottom } = useSafeAreaInsets();
  const snapPoints = React.useMemo(() => ["80%"], []);
  const hasSelected = useSharedValue(0);
  const [coords, setCoord] = React.useState({
    lat: initialState.lat,
    lon: initialState.lon,
  });

  const [selected, setSelected] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = React.useState({
    ...initialState.address,
  });

  const animatedGapStyle = useAnimatedStyle(() => {
    const gap = interpolate(hasSelected.value, [0, 1], [0, 10]);
    return {
      gap,
    };
  });
  const animatedButtonStyle = useAnimatedStyle(() => {
    const width = interpolate(hasSelected.value, [0, 1], [0, 150]);
    const height = interpolate(hasSelected.value, [0, 1], [0, 40]);
    const padding = interpolate(hasSelected.value, [0, 1], [0, 10]);
    const flex = interpolate(hasSelected.value, [0, 1], [0, 1]);
    return {
      width,
      height,
      padding,
      flex,
    };
  });
  const clear = () => {
    setSelected(null);
    setCoord({
      lat: initialState.lat,
      lon: initialState.lon,
    });
    setSelectedAddress({ ...initialState.address });
  };
  const select = () => {
    onChangeValue({
      lat: coords.lat,
      lon: coords.lon,
      address: {
        ...selectedAddress,
      },
    });
    dismiss();
  };

  React.useEffect(() => {
    hasSelected.value = withTiming(selected ? 1 : 0);
  }, [selected]);

  React.useEffect(() => {
    setCoord({
      lat: initialState.lat,
      lon: initialState.lon,
    });
  }, [initialState]);

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
      footerComponent={(p) => (
        <BottomSheetFooter {...p}>
          <Animated.View>
            <BlurView intensity={80} tint="extraLight">
              <Animated.View
                style={{
                  backgroundColor: "rgba(255, 255, 255, .5)",
                  padding: 10,
                  paddingBottom: bottom,
                  height: 130,
                }}
              >
                <Animated.Text
                  entering={SlideInLeft.delay(200).duration(100)}
                  style={{ fontFamily: FONTS.bold, fontSize: 20 }}
                >
                  {selectedAddress.city}
                </Animated.Text>
                <Animated.Text
                  entering={SlideInRight.delay(400).duration(200)}
                  style={{ fontFamily: FONTS.regular, color: COLORS.gray }}
                >
                  {selectedAddress.name} {selectedAddress.street},{" "}
                  {selectedAddress.district}
                </Animated.Text>

                <Animated.View
                  style={[
                    animatedGapStyle,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 10,
                    },
                  ]}
                >
                  <AnimatedTouchableOpacity
                    style={[
                      animatedButtonStyle,
                      {
                        backgroundColor: COLORS.secondary,
                        alignItems: "center",
                        borderRadius: 5,
                      },
                    ]}
                    onPress={clear}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 20,
                        fontFamily: FONTS.bold,
                      }}
                    >
                      Restore
                    </Text>
                  </AnimatedTouchableOpacity>
                  <AnimatedTouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.green,
                      padding: 10,
                      alignItems: "center",
                      borderRadius: 5,
                      maxWidth: 400,
                    }}
                    onPress={select}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 20,
                        fontFamily: FONTS.bold,
                      }}
                    >
                      Select
                    </Text>
                  </AnimatedTouchableOpacity>
                </Animated.View>
              </Animated.View>
            </BlurView>
          </Animated.View>
        </BottomSheetFooter>
      )}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <BottomSheetView
          style={{
            padding: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontFamily: FONTS.bold, fontSize: 20 }}>
            {location.address.city}
          </Text>
          <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
            {location.address.name} {location.address.street},{" "}
            {location.address.district}
          </Text>
        </BottomSheetView>

        <MapView
          initialRegion={{
            latitude: initialState.lat,
            longitude: initialState.lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={{
            flex: 1,
            width: "100%",
          }}
          showsUserLocation={true}
          zoomEnabled={true}
          zoomControlEnabled={true}
          pitchEnabled={true}
          followsUserLocation={true}
          showsTraffic={true}
          showsIndoorLevelPicker={true}
          loadingEnabled={true}
          provider={os === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          region={{
            latitude: initialState.lat,
            longitude: initialState.lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={async ({ nativeEvent: { coordinate } }) => {
            setSelected(coordinate);
            setCoord({ lat: coordinate.latitude, lon: coordinate.longitude });
            const address = await getLocationAddress({
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            });
            setSelectedAddress(address);
          }}
        >
          <Marker
            coordinate={{
              latitude: coords.lat,
              longitude: coords.lon,
            }}
            draggable={true}
            onDragEnd={async ({ nativeEvent: { coordinate } }) => {
              setSelected(coordinate);
              setCoord({ lat: coordinate.latitude, lon: coordinate.longitude });
              const address = await getLocationAddress({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
              });
              setSelectedAddress(address);
            }}
          >
            <Callout tooltip={true}>
              <View
                style={{
                  width: 200,
                  backgroundColor: COLORS.white,
                  padding: 10,
                  alignItems: "center",
                  height: 130,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    overflow: "hidden",
                  }}
                >
                  <Svg width={50} height={50}>
                    <ImageSvg
                      width={"100%"}
                      height={"100%"}
                      href={{
                        uri: me?.imageUrl,
                      }}
                    />
                  </Svg>
                </View>

                <Animated.Text
                  entering={SlideInLeft.delay(200).duration(100)}
                  style={{ fontFamily: FONTS.bold, fontSize: 20 }}
                >
                  {selectedAddress.city}
                </Animated.Text>
                <Animated.Text
                  entering={SlideInRight.delay(400).duration(200)}
                  style={{ fontFamily: FONTS.regular, color: COLORS.gray }}
                >
                  {selectedAddress.name} {selectedAddress.street},{" "}
                  {selectedAddress.district}
                </Animated.Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
        <Animated.View style={{ height: 130 }} />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default LocationPickerBottomSheet;
