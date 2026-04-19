import { useSSO } from "@clerk/expo";
import React, { useState } from "react";
import { View, Text, Alert } from "react-native";

const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      // checks if the user has been authenticated
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.log("Error in social auth", error);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert(
        "Error",
        `failed to sign in with ${provider}, please try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, handleSocialAuth };
};
// TODO: search on Alert in react native

export default useSocialAuth;
