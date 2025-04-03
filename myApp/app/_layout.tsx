import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import "react-native-url-polyfill/auto";

const RootLayoutNav = () => {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/set/[id]"
        options={{ presentation: "modal", title: "" }}
      />
    </Stack>
  );
};
export default RootLayoutNav;
