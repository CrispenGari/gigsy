import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "@/src/constants";
import { LinearGradient } from "expo-linear-gradient";
import { ProfileAvatar, Typography } from "@/src/components";
import { styles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInRight, SlideInLeft } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Profile = () => {
  const [state, setState] = React.useState({
    firstName: "",
    lastName: "",
  });
  const [image, setImage] = React.useState<string | undefined | null>(null);
  const save = async () => {};

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      style={{ backgroundColor: COLORS.dark.tertiary }}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={[COLORS.dark.main, COLORS.dark.tertiary]}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLORS.dark.main,
            padding: 10,
          }}
        >
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text
              style={[
                styles.h1,
                { color: COLORS.common.white, marginBottom: 20 },
              ]}
            >
              Set your Profile.
            </Text>

            <ProfileAvatar setBase64={setImage} />
          </View>
          <View
            style={[
              {
                flex: 1,
                width: "100%",
                maxWidth: 400,
              },
            ]}
          >
            <Animated.View
              entering={SlideInRight}
              exiting={SlideInLeft}
              style={{ flex: 1, justifyContent: "center" }}
            >
              <CustomTextInput
                placeholder="First Name"
                keyboardType="default"
                text={state.firstName}
                onChangeText={(text) =>
                  setState((state) => ({ ...state, firstName: text }))
                }
                leftIcon={
                  <Ionicons
                    name="person"
                    size={24}
                    color={COLORS.common.green}
                  />
                }
                inputStyle={{ fontSize: 20 }}
                containerStyles={{
                  borderRadius: 0,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}
              />
              <CustomTextInput
                placeholder="Last Name"
                leftIcon={
                  <Ionicons
                    name="person"
                    size={24}
                    color={COLORS.common.green}
                  />
                }
                inputStyle={{ fontSize: 20 }}
                containerStyles={{
                  borderRadius: 0,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                }}
                text={state.lastName}
                onChangeText={(text) =>
                  setState((state) => ({ ...state, lastName: text }))
                }
                onSubmitEditing={save}
              />

              <Typography
                style={{
                  color: COLORS.common.red,
                  fontSize: 20,
                  marginVertical: 20,
                }}
                variant="p"
              >
                Error
              </Typography>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={save}
                style={[
                  {
                    width: "100%",
                    marginTop: 30,
                    marginBottom: 10,
                    justifyContent: "center",
                    flexDirection: "row",
                    backgroundColor: COLORS.dark.tertiary,
                    maxWidth: 200,
                    padding: 10,
                    alignSelf: "flex-end",
                    borderRadius: 5,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.p,
                    { fontSize: 20, color: COLORS.common.white },
                  ]}
                >
                  SAVE
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Profile;
