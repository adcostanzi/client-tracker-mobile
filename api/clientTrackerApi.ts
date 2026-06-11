import { API_BASE_URL } from "@/constants/api";
import { Client } from "@/models/Client";
import { Job } from "@/models/Job";

export async function getClients(): Promise<Client[]> {
  const response = await fetch(`${API_BASE_URL}/clients`);

  if (!response.ok) {
    throw new Error("Failed to fecth clients");
  }

  return response.json();
}

export async function getClientById(clientId: string): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch client");
  }

  return response.json();
}

export async function createClient(client: {
  name: string;
  phone?: string;
  email?: string;
}): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });

  if (!response.ok) {
    throw new Error("Failed to create Client");
  }

  return response.json();
}

export async function deleteClient(clientId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete client");
  }
}
export async function updateClient(
  clientId: string,
  updates: {
    name?: string;
    phone?: string;
    email?: string;
  },
) {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update client");
  }

  return response.json();
}

export async function getJobs(): Promise<Job[]> {
  const response = await fetch(`${API_BASE_URL}/jobs`);

  if (!response.ok) {
    throw new Error("Failed to retrieve jobs");
  }

  return response.json();
}

export async function getJobsByClientId(clientId: string): Promise<Job[]> {
  const response = await fetch(`${API_BASE_URL}/jobs/client/${clientId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return response.json();
}

export async function updateJob(
  jobId: string,
  updates: {
    clientId?: string;
    description?: string;
    amount?: number;
    paidAmount?: number;
  },
): Promise<Job> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update job");
  }

  return response.json();
}

export async function deleteJob(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete job");
  }
}

export async function getClientBalance(clientId: string): Promise<number> {
  const response = await fetch(
    `${API_BASE_URL}/jobs/client/${clientId}/balance`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data = await response.json();

  return Number(data.totalOwed);
}

export async function createJob(job: {
  clientId: string;
  description: string;
  amount: number;
  paidAmount: number;
}): Promise<Job> {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  });

  if (!response.ok) {
    throw new Error("Failed to create Job");
  }

  return response.json();
}
