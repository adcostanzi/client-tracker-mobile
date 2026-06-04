export interface Job {
  id: string;
  clientId: string;
  description: string;
  amount: number;
  paidAmount: number;
  status: "pending" | "paid";
}
