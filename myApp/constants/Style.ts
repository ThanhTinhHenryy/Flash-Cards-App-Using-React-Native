import { StyleSheet } from "react-native";
import Colors from "./Colors";

export const defaultStyleSheet = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomButton: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    width: 300,
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
