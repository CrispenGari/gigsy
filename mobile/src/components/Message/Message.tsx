import { View, Text } from "react-native";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
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

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
const Message = ({ _id }: { _id: Id<"messages"> }) => {
  const message = useQuery(api.api.message.get, { _id });
  const { me } = useMeStore();
  const [loaded, setLoaded] = React.useState(true);
  if (!!!message) return <SkeletonMessage />;
  return (
    <View
      style={{
        maxWidth: "80%",
        alignSelf: me?.id === message.sender?.id ? "flex-end" : "flex-start",
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
          </>
        ) : null}
        <Text
          style={{
            fontFamily: FONTS.bold,
            color: me?.id === message.sender?.id ? COLORS.white : COLORS.black,
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
              me?.id === message.sender?.id ? COLORS.lightGray : COLORS.gray,
            alignSelf: "flex-end",
            marginTop: 2,
          }}
        >
          {dayjs(new Date(message._creationTime)).fromNow()} ago
        </Text>
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
    </View>
  );
};

export default Message;

const SkeletonMessage = () => <View></View>;
