import React, { createContext, useMemo, useState } from 'react';

export type Tx = {
  id: string;
  title: string;
  category: 'Food' | 'Transport' | 'Bills' | 'Shopping' | 'Income' | 'Other';
  amount: number; // + income, - expense
  dateISO: string; // yyyy-mm-dd
};

type Ctx = {
  items: Tx[];
  addTx: (tx: Omit<Tx, 'id'>) => void;
  removeTx: (id: string) => void;
};

const seed: Tx[] = [
  { id: '1', title: 'Tesco', category: 'Food', amount: -12.4, dateISO: '2026-01-06' },
  { id: '2', title: 'Bus', category: 'Transport', amount: -2.0, dateISO: '2026-01-05' },
  { id: '3', title: 'Salary', category: 'Income', amount: 450.0, dateISO: '2026-01-01' },
  { id: '4', title: 'Coffee', category: 'Food', amount: -3.2, dateISO: '2025-12-30' },
];

export const TransactionsContext = createContext<Ctx>({
  items: [],
  addTx: () => {},
  removeTx: () => {},
});

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Tx[]>(seed);

  const addTx: Ctx['addTx'] = (tx) => {
    setItems((prev) => [{ ...tx, id: String(Date.now()) }, ...prev]);
  };

  const removeTx: Ctx['removeTx'] = (id) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  const value = useMemo(() => ({ items, addTx, removeTx }), [items]);

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}
