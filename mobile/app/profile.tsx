import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "@/src/constants";
import { ProfileAvatar, Typography } from "@/src/components";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/src/components/CustomTextInput/CustomTextInput";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation, useRouter } from "expo-router";
import { useSettingsStore } from "@/src/store/settingsStore";
import { generateRNFile, onImpact } from "@/src/utils";
import { useMutation } from "@tanstack/react-query";
import { validateFace } from "@/src/utils/react-query";
import KeyboardAvoidingViewWrapper from "@/src/components/KeyboardAvoidingViewWrapper/KeyboardAvoidingViewWrapper";
import Spinner from "react-native-loading-spinner-overlay";
import { StackActions } from "@react-navigation/native";

const Profile = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const navigation = useNavigation();
  const [state, setState] = React.useState({
    firstName: "",
    lastName: "",
    error_msg: "",
    loading: false,
  });
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["verify"],
    mutationFn: validateFace,
  });
  const { settings } = useSettingsStore();
  const [base64Image, setBase64Image] = React.useState<
    string | undefined | null
  >(null);
  const [uriImage, setURIImage] = React.useState<string | undefined | null>(
    null
  );

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
      if (!!!base64Image || !!!uriImage) {
        return setState((s) => ({
          ...s,
          error_msg: "You are required to have a profile avatar with.",
          loading: false,
        }));
      }
      const face = generateRNFile({ name: "picture", uri: uriImage });
      const { valid } = await mutateAsync({ face });
      if (!valid)
        return setState((s) => ({
          ...s,
          error_msg:
            "You are required to have a profile avatar with a visible face of you.",
          loading: false,
        }));

      await user.update({
        firstName: state.firstName,
        lastName: state.lastName,
      });
      await user.setProfileImage({ file: base64Image });
      setState((s) => ({
        ...s,
        error_msg: "",
        loading: false,
      }));
      navigation.dispatch(StackActions.popToTop());
      setTimeout(() => {
        router.replace({
          pathname: "/",
        });
      }, 0);
    } catch (error: any) {
      setState((s) => ({
        ...s,
        error_msg: "Failed to save personal Profile information.",
        loading: false,
      }));
    }
  };

  return (
    <>
      <Spinner visible={state.loading || isPending} animation="fade" />
      <KeyboardAvoidingViewWrapper>
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
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 0.4,
            }}
          >
            <Text
              style={{
                color: COLORS.black,
                marginBottom: 20,
                fontFamily: FONTS.bold,
                fontSize: 20,
              }}
            >
              Set your Profile.
            </Text>
            <ProfileAvatar
              setBase64={setBase64Image}
              setURI={setURIImage}
              dimensions={{
                borderRadius: 100,
                height: 100,
                width: 100,
              }}
              iconSize={20}
            />
          </View>
          <Animated.View
            style={{
              flex: 1,
              width: "100%",
              maxWidth: 400,
              alignSelf: "center",
            }}
            entering={SlideInLeft.duration(200).delay(200)}
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
                paddingBottom: 0,
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
              style={styles.btn}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: COLORS.white,
                  fontFamily: FONTS.bold,
                }}
              >
                SAVE
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    marginVertical: 10,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green,
    maxWidth: 200,
    padding: 10,
    alignSelf: "flex-end",
    borderRadius: 5,
  },
});
