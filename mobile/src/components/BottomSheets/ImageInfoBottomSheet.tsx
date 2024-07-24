import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import Card from "../Card/Card";
import Animated, { SlideInDown, SlideInLeft } from "react-native-reanimated";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { MaterialIcons } from "@expo/vector-icons";
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});

const ImageInfoBottomSheet = React.forwardRef<
  BottomSheetModal,
  { id: Id<"users"> }
>(({ id }, ref) => {
  const user = useQuery(api.api.user.getById, { id });
  const snapPoints = React.useMemo(() => ["20%"], []);
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
          <Card
            style={{
              paddingHorizontal: 0,
            }}
          >
            <Animated.View
              style={{
                gap: 10,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 5,
                paddingBottom: 10,
              }}
              entering={SlideInLeft.delay(100).duration(200)}
            >
              <Animated.Image
                source={{ uri: user?.image }}
                style={{ width: 50, height: 50, borderRadius: 50 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.bold, fontSize: 16 }}>
                  {user?.firstName} {user?.lastName}{" "}
                  {user?.verified && (
                    <MaterialIcons
                      name="verified"
                      size={14}
                      color={COLORS.green}
                    />
                  )}
                </Text>
                <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                  {user?.email}
                </Text>
              </View>
            </Animated.View>
            <Animated.Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 16,
                color: COLORS.gray,
              }}
              entering={SlideInDown.delay(300).duration(300)}
            >
              Account Created: {dayjs(new Date(user?._creationTime!)).fromNow()}{" "}
              ago
            </Animated.Text>
          </Card>
        </BottomSheetView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ImageInfoBottomSheet;
