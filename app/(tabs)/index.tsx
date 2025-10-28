import { useAuth } from "@/context/AuthContext";
import { Tables } from "@/database.types";
import { supabase } from "@/services/supabase";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from "react-native";
import { Button, Checkbox, TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Todo = Tables<"todos">;

export default function TodoListScreen() {
  const { session } = useAuth();
  const theme = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) fetchTodos();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const channel = supabase
      .channel("todos-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        () => {
          fetchTodos();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, session]);

  const fetchTodos = async () => {
    if (!session) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) Alert.alert(error.message);
    else if (data) setTodos(data);
    setLoading(false);
  };

  const addTodo = async () => {
    if (task.trim().length === 0 || !session) return;
    setLoading(true);
    const { error } = await supabase
      .from("todos")
      .insert({ task_description: task, user_id: session.user.id })
      .select()
      .single();

    if (error) Alert.alert(error.message);
    setTask("");
    setLoading(false);
    fetchTodos();
  };

  const toggleComplete = async (id: number, currentState: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_complete: !currentState })
      .eq("id", id);

    if (error) Alert.alert(error.message);
    fetchTodos();
  };

  const renderItem: ListRenderItem<Todo> = ({ item }) => (
    <Checkbox.Item
      label={item.task_description}
      status={item.is_complete ? "checked" : "unchecked"}
      onPress={() => toggleComplete(item.id, item.is_complete || false)}
      style={[
        styles.todoItem,
        { backgroundColor: theme.colors.surfaceVariant },
      ]}
      labelStyle={[
        styles.todoText,
        item.is_complete && {
          textDecorationLine: "line-through",
          color: theme.colors.outline,
        },
      ]}
    />
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            label="New todo"
            mode="outlined"
            style={styles.input}
            value={task}
            onChangeText={setTask}
            disabled={loading}
          />
          <Button
            mode="contained"
            onPress={addTodo}
            icon="plus"
            style={styles.addButton}
            disabled={loading}
            loading={loading && task.trim().length > 0}
          >
            Add
          </Button>
        </View>

        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.flatList}
          onRefresh={fetchTodos}
          refreshing={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    paddingVertical: 6,
  },
  flatList: {
    flex: 1,
  },
  todoItem: {
    borderRadius: 8,
    marginBottom: 10,
  },
  todoText: {
    fontSize: 16,
  },
});
