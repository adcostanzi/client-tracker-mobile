import {
  createJob,
  getClientBalance,
  getClientById,
  getJobsByClientId,
} from "@/api/clientTrackerApi";
import { Client } from "@/models/Client";
import { Job } from "@/models/Job";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ClientDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [client, setClient] = useState<Client | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalOwed, setTotalOwed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  async function loadClientData() {
    if (!id) return;

    try {
      setIsLoading(true);
      setErrorMessage("");
      const clientData = await getClientById(id);
      const jobsData = await getJobsByClientId(id);
      const balance = await getClientBalance(id);

      setClient(clientData);
      setJobs(jobsData);
      setTotalOwed(balance);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load client data",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateJob() {
    if (!id) return;

    await createJob({
      clientId: id,
      description,
      amount: Number(amount) || 0,
      paidAmount: Number(paidAmount) || 0,
    });

    setDescription("");
    setAmount("");
    setPaidAmount("");

    await loadClientData();
  }

  useEffect(() => {
    loadClientData();
  }, [id]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: client?.name ?? "Client Details" }} />
      <FlatList
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
        keyboardShouldPersistTaps="handled"
        data={jobs}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
              {client?.name}
            </Text>
            <Text style={{ fontSize: 15, marginTop: 20 }}>
              Phone number: {client?.phone}
            </Text>
            <Text style={{ fontSize: 15, marginTop: 20 }}>
              Email: {client?.email}
            </Text>
            {errorMessage ? (
              <Text style={{ color: "red", marginTop: 10 }}>
                {errorMessage}
              </Text>
            ) : null}

            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
              Jobs
            </Text>
            <Text style={{ fontSize: 18, marginTop: 10 }}>
              Total Owed: ${totalOwed}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 6,
            }}
          >
            <Text>{item.description}</Text>
            <Text>Amount: ${item.amount}</Text>
            <Text>Paid: ${item.paidAmount}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
        ListFooterComponent={
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
              Add Job
            </Text>

            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
            />

            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
            />

            <TextInput
              placeholder="Paid Amount"
              value={paidAmount}
              onChangeText={setPaidAmount}
              keyboardType="numeric"
              style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
            />
            <View style={{ marginTop: 10 }}>
              <Button title="Save Job" onPress={handleCreateJob} />
            </View>
          </View>
        }
      />
    </View>
  );
}
