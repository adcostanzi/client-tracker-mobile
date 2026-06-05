import { getClients } from "@/api/clientTrackerApi";
import { Client } from "@/models/Client";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function ClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadClients() {
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
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Clients</Text>

      {errorMessage ? <Text>{errorMessage}</Text> : null}

      {/* <Button title="Add Client" onPress={() => router.push(`/add-client`)} /> */}

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            // onPress = {()=> router.push(`/clients/${item.id}`)}
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
      <Button title="Refresh" onPress={loadClients} />
    </View>
  );
}
