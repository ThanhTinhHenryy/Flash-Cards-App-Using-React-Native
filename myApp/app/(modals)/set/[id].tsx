import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addToFavorites, getSet, Set } from "@/data/api";
import { defaultStyleSheet } from "../../../constants/Style";
import { contains } from "@xata.io/client";
const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("📌 ID from useLocalSearchParams:", id);
  const [set, setSet] = useState<Set>();
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      console.warn("ID is undefined or null");
      return;
    }

    const loadSet = async () => {
      try {
        const data = await getSet(id);
        if (!data) {
          console.warn("No data received from API");
        }
        setSet(data);
      } catch (error) {
        console.error("Error fetching set:", error);
      }
    };
    loadSet();
  }, [id]);

  // * Thêm vào iu thích và back
  const onAddToFavorites = async () => {
    await addToFavorites(id!);
    router.push("/(tabs)/sets");
  };

  return (
    <View style={defaultStyleSheet.container}>
      {set && (
        <View
          style={{ alignItems: "flex-start", padding: 16, gap: 10, flex: 1 }}
        >
          <Text style={styles.header}>{set.title}</Text>
          <Text style={{ color: "#666" }}>{set.cards} Thẻ</Text>
          {set.image && (
            <Image
              source={{ uri: set.image.url }}
              style={{ width: "100%", height: 200 }}
            />
          )}
          <Text> {set.description} </Text>
          <Text style={{ color: "#666" }}> Tạo Bởi: {set.creator} </Text>
        </View>
      )}
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={defaultStyleSheet.bottomButton}
          onPress={onAddToFavorites}
        >
          <Text style={defaultStyleSheet.buttonText}>Thêm Vào Bộ Sưu Tập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Page;
