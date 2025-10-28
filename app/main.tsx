import Login from "@/components/auth/login";
import SignUp from "@/components/auth/signup";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const theme = useTheme();

  const [isLogin, setIsLogin] = useState(true);

  const handleFormChange = () => {
    setIsLogin(!isLogin);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {isLogin ? <Login /> : <SignUp />}
      <Button onPress={handleFormChange} style={styles.button}>
        Switch to {isLogin ? "Sign Up" : "Log In"}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
});
