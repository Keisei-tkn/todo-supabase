import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import "react-native-url-polyfill/auto";
import { supabase } from "../../services/supabase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <View style={[styles.bg, { backgroundColor: theme.colors.surface }]}>
      <Text variant="displayMedium" style={styles.text}>
        Sign Up
      </Text>
      <View
        style={[
          styles.form,
          { backgroundColor: theme.colors.onSurfaceVariant },
        ]}
      >
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>
      <Button
        mode="contained"
        onPress={handleSignUp}
        loading={loading}
        style={styles.button}
      >
        Sign Up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    alignContent: "center",
  },
  form: { padding: 20, borderRadius: 8, justifyContent: "center" },
  input: { marginVertical: 12 },
  text: { textAlign: "center", marginBottom: 24 },
  button: { marginTop: 16, padding: 8 },
});
