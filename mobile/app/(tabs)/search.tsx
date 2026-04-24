import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const SearchScreen = () => {
  const TRENDING_TOPICS = [
    { topic: "#ReactNative", tweets: "125K" },
    { topic: "#TypeScript", tweets: "89K" },
    { topic: "#WebDevelopment", tweets: "234K" },
    { topic: "#AI", tweets: "567K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
    { topic: "#TechNews", tweets: "98K" },
  ];
  return (
    <SafeAreaView className="bg-white">
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather size={20} color={"#657786"} />
          <TextInput
            placeholder="Search Mingle"
            className="
          flex-2 ml-3 text-base 
          "
            placeholderTextColor="#657786"
          />
        </View>
      </View>
      <ScrollView className="flex-1">
        <View className="px-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Trending For You
          </Text>
          {TRENDING_TOPICS.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="py-3 border-b border-gray-100"
            >
              <Text className="text-gray-500 text-sm">
                Trending in Technology
              </Text>
              <Text className="font-bold text-gray-900 text-lg">
                {item.topic}
              </Text>
              <Text className="text-gray-500 text-sm">
                {item.tweets} Tweets
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
