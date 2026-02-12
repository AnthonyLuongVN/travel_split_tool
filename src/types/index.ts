export interface Group {
  id: string;
  name: string;
  currency: string;
  members: Member[];
  transactions: Transaction[];
  settlements: Settlement[];
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  color: string; // For UI visualization
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  payerId: string; // Which member paid
  splits: { memberId: string; amount: number }[]; // Custom amounts per member
}

export interface Settlement {
  id: string;
  fromId: string; // Who pays
  toId: string; // Who receives
  amount: number;
  date: string;
  note?: string;
}

export interface Balance {
  memberId: string;
  balance: number; // negative = owed money, positive = owes money
}

export interface SimplifiedDebt {
  fromId: string;
  toId: string;
  amount: number;
}
