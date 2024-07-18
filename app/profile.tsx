import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "@/src/constants";
import { ProfileAvatar, Typography } from "@/src/components";
import { styles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInRight, SlideInLeft } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Ripple from "@/src/components/Ripple/Ripple";
import { useSettingsStore } from "@/src/store/settingsStore";
import { onImpact } from "@/src/utils";

const Profile = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [state, setState] = React.useState({
    firstName: "",
    lastName: "",
    error_msg: "",
    loading: false,
  });
  const { settings } = useSettingsStore();
  const [image, setImage] = React.useState<string | undefined | null>(null);
  const save = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!user || !isLoaded || !isSignedIn) return;
    setState((s) => ({
      ...s,
      loading: true,
    }));
    if (state.firstName.trim().length < 3 || state.lastName.trim().length < 3) {
      setState((s) => ({
        ...s,
        error_msg: "First name and Last name are required.",
        loading: false,
      }));
      return;
    }
    try {
      await user.update({
        firstName: state.firstName,
        lastName: state.lastName,
      });
      if (!!image) {
        await user.setProfileImage({ file: image });
      }
      setState((s) => ({
        ...s,
        error_msg: "",
        loading: false,
      }));
      router.replace("/");
    } catch (error: any) {
      setState((s) => ({
        ...s,
        error_msg: "Failed to save personal information.",
        loading: false,
      }));
    }
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      style={{ backgroundColor: COLORS.white }}
      contentContainerStyle={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.white,
          padding: 10,
        }}
      >
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text style={[styles.h1, { color: COLORS.white, marginBottom: 20 }]}>
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
            style={{ flex: 1 }}
          >
            <CustomTextInput
              placeholder="First Name"
              keyboardType="default"
              text={state.firstName}
              onChangeText={(text) =>
                setState((state) => ({ ...state, firstName: text }))
              }
              leftIcon={
                <Ionicons name="person" size={24} color={COLORS.green} />
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
                <Ionicons name="person" size={24} color={COLORS.green} />
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

            {!!state.error_msg ? (
              <Typography
                style={{
                  color: COLORS.red,
                  fontSize: 20,
                  marginVertical: 20,
                  textAlign: "center",
                }}
                variant="p"
              >
                {state.error_msg}
              </Typography>
            ) : null}
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
                  backgroundColor: state.loading
                    ? COLORS.tertiary
                    : COLORS.green,
                  maxWidth: 200,
                  padding: 10,
                  alignSelf: "flex-end",
                  borderRadius: 5,
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={[
                  styles.p,
                  {
                    fontSize: 20,
                    color: COLORS.white,
                    marginRight: state.loading ? 10 : 0,
                  },
                ]}
              >
                SAVE
              </Text>
              {state.loading ? <Ripple size={5} color={COLORS.white} /> : null}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Profile;
