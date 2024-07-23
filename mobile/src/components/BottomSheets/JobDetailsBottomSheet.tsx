import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFooter,
  useBottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { COLORS, FONTS, relativeTimeObject } from "@/src/constants";
import { usePlatform } from "@/src/hooks";
import Animated, { SlideInDown, SlideInLeft } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Id } from "@/convex/_generated/dataModel";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useRouter } from "expo-router";
import Card from "../Card/Card";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { useMeStore } from "@/src/store/meStore";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLocationStore } from "@/src/store/locationStore";
import { useWishlistStore } from "@/src/store/wishlistStore";
import Spinner from "react-native-loading-spinner-overlay";
import { onImpact } from "@/src/utils";
import { useSettingsStore } from "@/src/store/settingsStore";
import ContentLoader from "../ContentLoader/ContentLoader";
import { calculateDistance } from "@/src/utils/distance";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale("en", {
  relativeTime: relativeTimeObject,
});
interface JobDetailsBottomSheetProps {
  id: Id<"jobs">;
}
const JobDetailsBottomSheet = React.forwardRef<
  BottomSheetModal,
  JobDetailsBottomSheetProps
>(({ id }, ref) => {
  const job = useQuery(api.api.job.getJobById, { id });
  const { os } = usePlatform();
  const { dismiss } = useBottomSheetModal();
  const { location } = useLocationStore();
  const [loaded, setLoaded] = React.useState(true);
  const { me } = useMeStore();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const snapPoints = React.useMemo(() => ["80%"], []);
  const [state, setState] = React.useState({
    exists: false,
    loading: false,
  });
  const { wishlists, add, remove } = useWishlistStore();
  const addMutation = useMutation(api.api.wishlist.add);
  const removeMutation = useMutation(api.api.wishlist.remove);
  const { settings } = useSettingsStore();
  const addOrRemove = async () => {
    if (settings.haptics) {
      await onImpact();
    }
    if (!!!job || !!!me) return;

    setState((s) => ({ ...s, loading: true }));
    if (state.exists) {
      removeMutation({ jobId: job._id!, userId: me.id })
        .then((wishlist) => {
          if (!!wishlist) {
            remove(wishlist);
          }
        })
        .finally(() => setState((s) => ({ ...s, loading: false })));
    } else {
      addMutation({ jobId: job._id!, userId: me.id })
        .then((wishlist) => {
          if (!!wishlist) {
            add(wishlist);
          }
        })
        .finally(() => setState((s) => ({ ...s, loading: false })));
    }
  };

  const startChat = async () => {
    if (settings.haptics) {
      await onImpact();
    }
  };

  React.useEffect(() => {
    const exists = !!wishlists.find((w) => w.jobId === id);
    setState((s) => ({ ...s, exists }));
  }, [wishlists, id]);

  if (!!!job)
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
            <View>
              <BlurView intensity={80} tint="extraLight">
                <View
                  style={{
                    backgroundColor: "rgba(255, 255, 255, .5)",
                    padding: 10,
                    paddingBottom: bottom + 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: COLORS.gray,
                    height: 100,
                  }}
                >
                  <ContentLoader style={[styles.btn, { height: 40 }]} />
                  <ContentLoader style={[styles.btn, { height: 40 }]} />
                </View>
              </BlurView>
            </View>
          </BottomSheetFooter>
        )}
      >
        <JobBottomSheetSkeleton />
      </BottomSheetModal>
    );

  return (
    <>
      <Spinner visible={state.loading} animation="fade" />
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
            <Animated.View entering={SlideInDown.duration(200).delay(200)}>
              <BlurView intensity={80} tint="extraLight">
                <Animated.View
                  style={{
                    backgroundColor: "rgba(255, 255, 255, .5)",
                    padding: 10,
                    paddingBottom: bottom + 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: COLORS.gray,
                    height: 100,
                  }}
                >
                  <TouchableOpacity
                    disabled={me?.id === job?.user?.id}
                    style={[
                      styles.btn,
                      {
                        backgroundColor: state.exists
                          ? COLORS.red
                          : me?.id === job?.user?.id
                            ? COLORS.semiGray
                            : COLORS.gray,
                      },
                    ]}
                    onPress={addOrRemove}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 20,
                        fontFamily: FONTS.bold,
                      }}
                    >
                      {state.exists
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"}
                    </Text>
                    <Ionicons
                      name={state.exists ? "heart" : "headset-outline"}
                      size={18}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={me?.id === job?.user?.id}
                    style={[
                      styles.btn,
                      {
                        backgroundColor:
                          me?.id === job?.user?.id
                            ? COLORS.tertiary
                            : COLORS.green,
                        flex: 0,
                        minWidth: 150,
                      },
                    ]}
                    onPress={startChat}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 20,
                        fontFamily: FONTS.bold,
                      }}
                    >
                      Start Chat
                    </Text>
                    <Ionicons
                      name="send-outline"
                      color={COLORS.white}
                      size={18}
                    />
                  </TouchableOpacity>
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
              {job?.title}
            </Text>
            <View
              style={{
                gap: 5,
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: 5,
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
              >
                <Ionicons
                  name="location-outline"
                  color={COLORS.gray}
                  size={14}
                />
                <Text style={styles.mutedText}>
                  {job?.location?.address.city}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
              >
                <Ionicons name="time-outline" color={COLORS.gray} size={14} />
                <Text style={styles.mutedText}>
                  Listed {dayjs(new Date(job?._creationTime!)).fromNow()} ago.
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
              >
                <Ionicons name="timer-outline" color={COLORS.gray} size={14} />
                <Text style={styles.mutedText}>
                  {job?.type === "part-time" ? "Part Time" : "Full Time"}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
            >
              <MaterialCommunityIcons
                name={"map-marker-distance"}
                color={COLORS.gray}
                size={14}
              />
              <Text style={styles.mutedText}>
                {calculateDistance(
                  {
                    longitude: location.lon,
                    latitude: location.lat,
                  },
                  {
                    latitude: job?.location?.lat!,
                    longitude: job?.location?.lon!,
                  },
                  settings.location.metric
                )}{" "}
                away
              </Text>
            </View>
          </BottomSheetView>
          <BottomSheetScrollView
            style={{
              backgroundColor: COLORS.lightGray,
              padding: 10,
            }}
            contentContainerStyle={{ paddingBottom: 150 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Card
              style={{
                padding: 10,
                maxWidth: 400,
                borderRadius: 5,
                width: "100%",
              }}
            >
              <View>
                <Text
                  style={[
                    styles.headerText,
                    {
                      fontSize: 20,
                      marginBottom: 10,
                    },
                  ]}
                >
                  Advertiser Profile
                </Text>
              </View>

              <AnimatedTouchableOpacity
                onPress={async () => {
                  if (settings.haptics) {
                    await onImpact();
                  }
                  dismiss();
                  router.navigate(
                    me?.id === job?.user?.id
                      ? {
                          pathname: "/(profile)/me",
                        }
                      : {
                          pathname: "/(user)/[id]",
                          params: { id: job?.user?._id },
                        }
                  );
                }}
                style={{
                  gap: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 5,
                  paddingBottom: 10,
                }}
                entering={SlideInLeft.delay(100).duration(200)}
              >
                {!loaded ? (
                  <ContentLoader
                    style={{
                      zIndex: 1,
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      right: 0,
                      display: loaded ? "none" : "flex",
                      backgroundColor: COLORS.lightGray,
                      overflow: "hidden",
                    }}
                  />
                ) : null}
                <Animated.Image
                  source={{ uri: job?.user?.image }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    display: loaded ? "flex" : "none",
                  }}
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
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONTS.bold, fontSize: 16 }}>
                    {job?.user?.firstName} {job?.user?.lastName}
                  </Text>
                  <Text
                    style={{ fontFamily: FONTS.regular, color: COLORS.gray }}
                  >
                    {job?.user?.email} {job?.user?.id === me?.id && "● you"}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={COLORS.gray}
                />
              </AnimatedTouchableOpacity>
            </Card>

            <Text style={styles.headerText}>Basic Information</Text>
            <Card
              style={{
                padding: 10,
                maxWidth: 400,
                borderRadius: 5,
                width: "100%",
              }}
            >
              <Animated.View
                entering={SlideInLeft.duration(100).delay(100)}
                style={{}}
              >
                <Animated.Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
                  Position: {job?.title}
                </Animated.Text>
                <Text style={{ fontFamily: FONTS.regular }}>
                  {job?.description}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                    marginTop: 10,
                  }}
                >
                  Company: {job?.company}
                </Text>
                <Text style={{ fontFamily: FONTS.regular }}>
                  {job?.companyDescription ||
                    "No company or individual description provided."}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                    marginTop: 10,
                  }}
                >
                  Location: {job?.location?.address.city}
                </Text>
                <Text
                  style={{ fontFamily: FONTS.regular, color: COLORS.black }}
                >
                  {job?.location?.address.country} (
                  {job?.location?.address.isoCountryCode?.toLocaleLowerCase()})
                </Text>

                <MapView
                  initialRegion={{
                    latitude: job?.location?.lat || location.lat,
                    longitude: job?.location?.lon || location.lon,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  style={{
                    width: "100%",
                    height: 200,
                    marginTop: 10,
                    borderRadius: 5,
                  }}
                  showsUserLocation={false}
                  zoomEnabled={true}
                  zoomControlEnabled={true}
                  pitchEnabled={true}
                  followsUserLocation={false}
                  showsTraffic={true}
                  showsIndoorLevelPicker={true}
                  loadingEnabled={true}
                  provider={
                    os === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                  }
                  region={{
                    latitude: job?.location?.lat || location.lat,
                    longitude: job?.location?.lon || location.lon,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                />
              </Animated.View>
            </Card>

            <Text style={styles.headerText}>Contact Information</Text>
            <Card
              style={{
                padding: 10,
                maxWidth: 400,
                borderRadius: 5,
                width: "100%",
              }}
            >
              <Animated.View
                entering={SlideInLeft.duration(100).delay(100)}
                style={{}}
              >
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
                      Contact Name
                    </Text>
                    <Text
                      style={{ fontFamily: FONTS.regular, color: COLORS.gray }}
                    >
                      {job?.contactName}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.bold,
                        fontSize: 18,
                      }}
                    >
                      Contact Email
                    </Text>
                    <Text
                      style={{ fontFamily: FONTS.regular, color: COLORS.gray }}
                    >
                      {job?.contactEmail}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                    marginTop: 10,
                  }}
                >
                  Contact Phone Number
                </Text>
                <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                  {job?.contactPhone || "None."}
                </Text>
              </Animated.View>
            </Card>

            <Text style={styles.headerText}>Job Payment Information</Text>
            <Card
              style={{
                padding: 10,
                maxWidth: 400,
                borderRadius: 5,
                width: "100%",
              }}
            >
              <Animated.View
                entering={SlideInLeft.duration(100).delay(100)}
                style={{}}
              >
                <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
                  Job Type
                </Text>
                <Text style={{ fontFamily: FONTS.regular, color: COLORS.gray }}>
                  {job?.type === "full-time" ? "Full Time" : "Part Time"}
                </Text>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.bold,
                        fontSize: 18,
                        marginTop: 10,
                      }}
                    >
                      Minimum Salary
                    </Text>
                    <Text
                      style={{ fontFamily: FONTS.regular, color: COLORS.gray }}
                    >
                      R {job?.salaryRange?.min || 0}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.bold,
                        fontSize: 18,
                        marginTop: 10,
                      }}
                    >
                      Maximum Salary
                    </Text>
                    <Text
                      style={{ fontFamily: FONTS.regular, color: COLORS.gray }}
                    >
                      R {job?.salaryRange?.max}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </Card>

            <Text style={styles.headerText}>Additional Information</Text>
            <Card
              style={{
                padding: 10,
                maxWidth: 400,
                borderRadius: 5,
                width: "100%",
              }}
            >
              <Animated.View entering={SlideInLeft.duration(100).delay(100)}>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
                      Skills Required
                    </Text>
                    {job?.skills?.map((skill) => (
                      <TouchableOpacity
                        key={skill}
                        style={{ flexDirection: "row", gap: 10 }}
                      >
                        <MaterialIcons
                          name="clean-hands"
                          size={16}
                          color={COLORS.gray}
                        />
                        <Text style={{ fontFamily: FONTS.bold }}>{skill}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
                      Job Benefits
                    </Text>
                    {job?.benefits?.map((bene) => (
                      <TouchableOpacity
                        key={bene}
                        style={{ flexDirection: "row", gap: 10 }}
                      >
                        <Ionicons
                          name="bag-add-outline"
                          size={16}
                          color={COLORS.gray}
                        />
                        <Text style={{ fontFamily: FONTS.bold }}>{bene}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.bold,
                        fontSize: 18,
                        marginTop: 10,
                      }}
                    >
                      Job Experience
                    </Text>
                    {job?.experience?.map((exp) => (
                      <View key={exp} style={{ flexDirection: "row", gap: 10 }}>
                        <Ionicons
                          name="star-outline"
                          size={16}
                          color={COLORS.gray}
                        />
                        <Text style={{ fontFamily: FONTS.bold }}>{exp}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.bold,
                        fontSize: 18,
                        marginTop: 10,
                      }}
                    >
                      Education Qualifications
                    </Text>
                    {job?.educationLevels?.map((level) => {
                      return (
                        <View
                          key={level}
                          style={{ flexDirection: "row", gap: 10 }}
                        >
                          <MaterialIcons
                            name="padding"
                            size={16}
                            color={COLORS.gray}
                          />
                          <Text style={{ fontFamily: FONTS.bold }}>
                            {level}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </Animated.View>
            </Card>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
});

export default JobDetailsBottomSheet;

const JobBottomSheetSkeleton = () => (
  <View style={{ flex: 1 }}>
    <View
      style={{
        padding: 10,
        marginBottom: 10,
      }}
    >
      <ContentLoader style={{ width: 250, height: 20, borderRadius: 5 }} />
      <View
        style={{
          gap: 5,
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: 5,
        }}
      >
        <ContentLoader style={{ width: 80, height: 10, borderRadius: 5 }} />
        <ContentLoader style={{ width: 80, height: 10, borderRadius: 5 }} />
        <ContentLoader style={{ width: 120, height: 10, borderRadius: 5 }} />
        <ContentLoader style={{ width: 80, height: 10, borderRadius: 5 }} />
      </View>
    </View>
    <BottomSheetScrollView
      style={{
        backgroundColor: COLORS.lightGray,
        padding: 10,
      }}
      contentContainerStyle={{ paddingBottom: 150 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Card
        style={{
          padding: 10,
          maxWidth: 400,
          borderRadius: 5,
          width: "100%",
        }}
      >
        <ContentLoader style={{ width: 200, height: 15, borderRadius: 5 }} />
        <View
          style={{
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 5,
            paddingBottom: 10,
          }}
        >
          <ContentLoader style={{ width: 50, height: 50, borderRadius: 50 }} />
          <View style={{ flex: 1, gap: 3 }}>
            <ContentLoader
              style={{ width: 150, height: 15, borderRadius: 5 }}
            />
            <ContentLoader
              style={{ width: 100, height: 10, borderRadius: 5 }}
            />
          </View>
          <ContentLoader style={{ width: 20, height: 20, borderRadius: 5 }} />
        </View>
      </Card>

      <ContentLoader
        style={{ width: 200, height: 15, borderRadius: 5, marginVertical: 10 }}
      />
      <Card
        style={{
          padding: 10,
          maxWidth: 400,
          borderRadius: 5,
          width: "100%",
        }}
      >
        <View style={{ gap: 3 }}>
          <ContentLoader style={{ width: 300, height: 15, borderRadius: 5 }} />
          <ContentLoader
            style={{ width: "100%", height: 10, borderRadius: 5 }}
          />
          <ContentLoader
            style={{ width: "100%", height: 10, borderRadius: 5 }}
          />
          <ContentLoader
            style={{ width: "50%", height: 10, borderRadius: 5 }}
          />
          <ContentLoader
            style={{ width: 300, height: 15, borderRadius: 5, marginTop: 10 }}
          />
          <ContentLoader
            style={{ width: "100%", height: 10, borderRadius: 5 }}
          />
          <ContentLoader
            style={{ width: "50%", height: 10, borderRadius: 5 }}
          />
          <ContentLoader
            style={{ width: 300, height: 15, borderRadius: 5, marginTop: 10 }}
          />
          <ContentLoader
            style={{ width: "50%", height: 10, borderRadius: 5 }}
          />
          <ContentLoader
            style={{
              width: "100%",
              height: 200,
              marginTop: 10,
              borderRadius: 5,
            }}
          />
        </View>
      </Card>
      <ContentLoader
        style={{ width: 200, height: 15, borderRadius: 5, marginVertical: 10 }}
      />
      <Card
        style={{
          padding: 10,
          maxWidth: 400,
          borderRadius: 5,
          width: "100%",
        }}
      >
        <View style={{}}>
          <View style={styles.row}>
            <View style={{ flex: 1, gap: 3 }}>
              <ContentLoader
                style={{ width: 150, height: 15, borderRadius: 5 }}
              />

              <ContentLoader
                style={{ width: 100, height: 10, borderRadius: 5 }}
              />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <ContentLoader
                style={{ width: 150, height: 15, borderRadius: 5 }}
              />

              <ContentLoader
                style={{ width: 100, height: 10, borderRadius: 5 }}
              />
            </View>
          </View>

          <View style={{ flex: 1, gap: 3, marginTop: 10 }}>
            <ContentLoader
              style={{ width: 150, height: 15, borderRadius: 5 }}
            />

            <ContentLoader
              style={{ width: 100, height: 10, borderRadius: 5 }}
            />
          </View>
        </View>
      </Card>

      <ContentLoader
        style={{ width: 200, height: 15, borderRadius: 5, marginVertical: 10 }}
      />
      <Card
        style={{
          padding: 10,
          maxWidth: 400,
          borderRadius: 5,
          width: "100%",
        }}
      >
        <View style={{}}>
          <View style={{ flex: 1, gap: 3, marginBottom: 10 }}>
            <ContentLoader
              style={{ width: 150, height: 15, borderRadius: 5 }}
            />

            <ContentLoader
              style={{ width: 100, height: 10, borderRadius: 5 }}
            />
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, gap: 3 }}>
              <ContentLoader
                style={{ width: 150, height: 15, borderRadius: 5 }}
              />

              <ContentLoader
                style={{ width: 100, height: 10, borderRadius: 5 }}
              />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <ContentLoader
                style={{ width: 150, height: 15, borderRadius: 5 }}
              />

              <ContentLoader
                style={{ width: 100, height: 10, borderRadius: 5 }}
              />
            </View>
          </View>
        </View>
      </Card>

      <ContentLoader
        style={{ width: 200, height: 15, borderRadius: 5, marginVertical: 10 }}
      />
      <Card
        style={{
          padding: 10,
          maxWidth: 400,
          borderRadius: 5,
          width: "100%",
        }}
      >
        <View>
          <View style={styles.row}>
            <View style={{ flex: 1, gap: 3 }}>
              <ContentLoader
                style={{ width: 150, height: 15, borderRadius: 5 }}
              />

              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <View key={index} style={{ flexDirection: "row", gap: 10 }}>
                    <ContentLoader
                      style={{ width: 100, height: 10, borderRadius: 5 }}
                    />
                  </View>
                ))}
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <ContentLoader
                style={{ width: 150, height: 15, borderRadius: 5 }}
              />

              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <View key={index} style={{ flexDirection: "row", gap: 10 }}>
                    <ContentLoader
                      style={{ width: 100, height: 10, borderRadius: 5 }}
                    />
                  </View>
                ))}
            </View>
          </View>

          <View style={[styles.row, { marginTop: 10 }]}>
            <View style={{ flex: 1, gap: 3 }}>
              <ContentLoader
                style={{ width: 150, height: 15, borderRadius: 5 }}
              />

              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <View key={index} style={{ flexDirection: "row", gap: 10 }}>
                    <ContentLoader
                      style={{ width: 100, height: 10, borderRadius: 5 }}
                    />
                  </View>
                ))}
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <ContentLoader
                style={{ width: 150, height: 15, borderRadius: 5 }}
              />

              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <View key={index} style={{ flexDirection: "row", gap: 10 }}>
                    <ContentLoader
                      style={{ width: 100, height: 10, borderRadius: 5 }}
                    />
                  </View>
                ))}
            </View>
          </View>
        </View>
      </Card>
    </BottomSheetScrollView>
  </View>
);

const styles = StyleSheet.create({
  mutedText: { fontFamily: FONTS.regular, color: COLORS.gray },
  btn: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    maxWidth: 400,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  headerText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginLeft: 10,
    marginTop: 10,
  },
  row: {
    gap: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
