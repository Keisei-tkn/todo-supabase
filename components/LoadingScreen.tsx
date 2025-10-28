import { StyleSheet, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

export default function LoadingScreen() {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        animating={true}
        color={theme.colors.primary}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
