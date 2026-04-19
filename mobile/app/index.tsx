import { useClerk } from "@clerk/expo";
import React from "react";
import { View, Text, Button } from "react-native";

const HomeScreen = () => {
  const { signOut } = useClerk();
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button onPress={() => signOut()} title="Logout"></Button>
    </View>
  );
};

export default HomeScreen;
