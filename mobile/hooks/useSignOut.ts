import { useClerk } from "@clerk/expo";
import React from "react";
import { Alert } from "react-native";

const useSignOut = () => {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };
  return { handleSignOut };
};

export default useSignOut;
