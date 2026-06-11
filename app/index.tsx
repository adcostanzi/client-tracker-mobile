import { getClients } from "@/api/clientTrackerApi";
import { Client } from "@/models/Client";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ClientsScreen() {
  const insets = useSafeAreaInsets();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadClients() {
    /*Get all clients and loads error if failed */
    try {
      setIsLoading(true);
      const data = await getClients();
      setClients(data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Unable to load clients");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ padding: 20, flex: 1, paddingBottom: insets.bottom + 20 }}>
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <View style={{ marginBottom: 10 }}>
        <Button title="Add Client" onPress={() => router.push(`/add-client`)} />
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/clients/${item.id}`)}
            style={{
              padding: 12,
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Text>{item.phone}</Text>
            <Text>{item.email}</Text>
          </Pressable>
        )}
      />
      <View style={{ marginTop: 10 }}>
        <Button title="Refresh" onPress={loadClients} />
      </View>
    </View>
  );
}
