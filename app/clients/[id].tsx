import {
  createJob,
  deleteClient,
  deleteJob,
  getClientBalance,
  getClientById,
  getJobsByClientId,
  updateClient,
  updateJob,
} from "@/api/clientTrackerApi";
import { Client } from "@/models/Client";
import { Job } from "@/models/Job";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Pressable,
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

  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editPaidAmount, setEditPaidAmount] = useState("");

  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editClientName, setEditClientName] = useState("");
  const [editClientPhone, setEditClientPhone] = useState("");
  const [editClientEmail, setEditClientEmail] = useState("");

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
    /*Creates Job based on user inputs, resets inputs and reloads client data*/
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
  function startEditingClient() {
    /*Opens up client edit form*/
    if (!client) return;

    setIsEditingClient(true);
    setEditClientName(client.name);
    setEditClientPhone(client.phone ?? "");
    setEditClientEmail(client.email ?? "");
  }

  function cancelEditingClient() {
    /*Resets client inputs*/
    setIsEditingClient(false);
    setEditClientName("");
    setEditClientPhone("");
    setEditClientEmail("");
  }

  async function handleUpdateClient() {
    /*Creates Client based on user inputs, resets inputs and reloads client data*/
    if (!id) return;

    try {
      await updateClient(id, {
        name: editClientName,
        phone: editClientPhone,
        email: editClientEmail,
      });

      cancelEditingClient();
      await loadClientData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update client",
      );
    }
  }

  function confirmDeleteClient() {
    /*Displays alert confirmation for deletion, then redirects user to index if confirmed*/
    if (!id) return;
    Alert.alert(
      "Delete Client",
      "Are you sure you want to delete this client? All data, including jobs, will be lost",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteClient(id);
              router.back();
            } catch (error) {
              setErrorMessage(
                error instanceof Error
                  ? error.message
                  : "Unable to delete client",
              );
            }
          },
        },
      ],
    );
  }

  function startEditingJob(job: Job) {
    /*Opens up job edit form*/
    setEditingJobId(job.id);
    setEditDescription(job.description);
    setEditAmount(job.amount.toString());
    setEditPaidAmount(job.paidAmount.toString());
  }

  function cancelEditingJob() {
    /*Clears job editing form*/
    setEditingJobId(null);
    setEditDescription("");
    setEditAmount("");
    setEditPaidAmount("");
  }

  async function handleUpdateJob(jobId: string) {
    /*Updates job and reloads client data*/
    await updateJob(jobId, {
      description: editDescription,
      amount: Number(editAmount) || 0,
      paidAmount: Number(editPaidAmount) || 0,
    });
    cancelEditingJob();
    await loadClientData();
  }

  async function handleDeleteJob(jobId: string) {
    await deleteJob(jobId);
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
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
        keyboardShouldPersistTaps="handled"
        data={jobs}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          isEditingClient ? (
            <View>
              <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
                Edit Client
              </Text>

              <TextInput
                placeholder="Name"
                value={editClientName}
                onChangeText={setEditClientName}
                style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
              />

              <TextInput
                placeholder="Phone"
                value={editClientPhone}
                onChangeText={setEditClientPhone}
                style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
              />

              <TextInput
                placeholder="Email"
                value={editClientEmail}
                onChangeText={setEditClientEmail}
                style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
              />

              <View style={{ marginTop: 10 }}>
                <Button title="Save Client" onPress={handleUpdateClient} />
              </View>

              <View style={{ marginTop: 10 }}>
                <Button title="Cancel" onPress={cancelEditingClient} />
              </View>
            </View>
          ) : (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold", flex: 1 }}>
                  {client?.name}
                </Text>

                <Pressable
                  onPress={startEditingClient}
                  hitSlop={8}
                  style={{ padding: 6 }}
                >
                  <Ionicons name="pencil" size={22} color="#EAB308" />
                </Pressable>

                <Pressable
                  onPress={confirmDeleteClient}
                  hitSlop={8}
                  style={{ padding: 6, marginLeft: 8 }}
                >
                  <Ionicons name="trash" size={22} color="#EF4444" />
                </Pressable>
              </View>

              <Text style={{ fontSize: 15, marginTop: 20 }}>
                Phone number: {client?.phone}
              </Text>

              <Text style={{ fontSize: 15, marginTop: 20 }}>
                Email: {client?.email}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const isEditing = editingJobId === item.id;

          return (
            <View
              style={{
                padding: 12,
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 6,
              }}
            >
              {isEditing ? (
                <View>
                  <TextInput
                    placeholder="Description"
                    value={editDescription}
                    onChangeText={setEditDescription}
                    style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
                  />

                  <TextInput
                    placeholder="Amount"
                    value={editAmount}
                    onChangeText={setEditAmount}
                    keyboardType="numeric"
                    style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
                  />

                  <TextInput
                    placeholder="Paid Amount"
                    value={editPaidAmount}
                    onChangeText={setEditPaidAmount}
                    keyboardType="numeric"
                    style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
                  />

                  <View style={{ marginTop: 10 }}>
                    <Button
                      title="Save Changes"
                      onPress={() => handleUpdateJob(item.id)}
                    />
                  </View>

                  <View style={{ marginTop: 10 }}>
                    <Button title="Cancel" onPress={cancelEditingJob} />
                  </View>
                </View>
              ) : (
                <View>
                  <Text>{item.description}</Text>
                  <Text>Amount: ${item.amount}</Text>
                  <Text>Paid: ${item.paidAmount}</Text>
                  <Text>Status: {item.status}</Text>

                  <View style={{ marginTop: 10 }}>
                    <Button
                      title="Edit"
                      onPress={() => startEditingJob(item)}
                    />
                  </View>

                  <View style={{ marginTop: 10 }}>
                    <Button
                      title="Delete"
                      onPress={() => handleDeleteJob(item.id)}
                    />
                  </View>
                </View>
              )}
            </View>
          );
        }}
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
