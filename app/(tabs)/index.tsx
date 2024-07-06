import { View } from "react-native";
import React from "react";
import Typography from "@/src/components/Typography/Typography";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { Button } from "react-native";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Typography
        variant="h3"
        style={{
          textDecorationStyle: "solid",
          textDecorationLine: "underline",
        }}
      >
        {JSON.stringify({
          user: {
            email: user?.primaryEmailAddressId,
            firstName: user?.firstName,
            lastName: user?.lastName,
          },
        })}
      </Typography>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default Home;
