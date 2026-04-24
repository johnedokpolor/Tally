import { useState } from "react";
import "../global.css";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useSocialAuth from "@/hooks/useSocialAuth";

export default function App() {
  const { isLoading, handleSocialAuth } = useSocialAuth();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image
        className="size-96"
        source={require("../../assets/images/auth2.png")}
        resizeMode="contain"
      />

      <TouchableOpacity
        className="flex-row gap-2 w-[80vw]  items-center justify-center border border-gray-300 rounded-full py-3 px-6"
        onPress={() => {
          handleSocialAuth("oauth_google");
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#4285F4" />
        ) : (
          <>
            <Image
              className="size-10"
              source={require("../../assets/images/google.png")}
              resizeMode="contain"
            />
            <Text className="text-base font-bold">Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row gap-2 w-[80vw] mt-3 items-center justify-center border border-gray-300 rounded-full py-3 px-6"
        onPress={() => {
          handleSocialAuth("oauth_apple");
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            <Image
              className="size-8"
              source={require("../../assets/images/apple.png")}
              resizeMode="contain"
            />
            <Text className="text-base font-bold">Continue with Apple</Text>
          </>
        )}
      </TouchableOpacity>

      <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
        By signing up, you agree to our{" "}
        <Text className="text-blue-500">Terms</Text>
        {", "}
        <Text className="text-blue-500">Privacy Policy</Text>
        {", and "}
        <Text className="text-blue-500">Cookie Use</Text>.
      </Text>
    </View>
  );
}

const style = StyleSheet.create({
  header: {
    color: "red",
    backgroundColor: "blue",
  },
});
