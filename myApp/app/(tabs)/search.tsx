import {
  View,
  Text,
  ListRenderItem,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Set, getSets } from "@/data/api";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import { transformImage } from "@xata.io/client";
import { defaultStyleSheet } from "@/constants/Style";

const Page = () => {
  const [sets, setSets] = useState<Set[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSets();
  }, []);

  const loadSets = async () => {
    try {
      setIsRefreshing(true);
      const data = await getSets();
      setSets(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderSetRow: ListRenderItem<Set> = ({ item }) => {
    return (
      <Link href={`/(modals)/set/${item.xata_id}`} asChild>
        <TouchableOpacity style={styles.setRow}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {item.image && (
              <Image
                source={{
                  uri: transformImage(item.image.url, {
                    width: 100,
                    height: 100,
                  }),
                }}
                style={{ width: 50, height: 50, borderRadius: 8 }}
              />
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={{ color: Colors.darkGrey }}>{item.cards} Cards</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#ccc" />
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={defaultStyleSheet.container}>
      {/* <Text>search Sets</Text> */}
      <FlatList
        data={sets}
        renderItem={renderSetRow}
        keyExtractor={(item) => item.xata_id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={loadSets} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  setRow: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Page;
