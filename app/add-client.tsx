import { createClient } from "@/api/clientTrackerApi";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function AddClientScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCreateClient() {
    try {
      if (!name.trim()) {
        setErrorMessage("Client name is required");
        return;
      }

      await createClient({
        name,
        phone,
        email,
      });

      router.back();
    } catch (error) {
      setErrorMessage("Unable to create client");
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Stack.Screen options={{ title: "Add Client" }} />

      {errorMessage ? (
        <Text style={{ color: "red" }}>{errorMessage}</Text>
      ) : null}

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
      />

      <TextInput
        placeholder="Phone number"
        value={phone}
        onChangeText={setPhone}
        style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
      />
      <View style={{ marginTop: 10 }}>
        <Button title="Save Client" onPress={handleCreateClient} />
      </View>
    </View>
  );
}
