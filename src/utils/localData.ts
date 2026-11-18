import type { OrderHistoryItem, SavedAddress } from "@/types";

type StoredOrder = OrderHistoryItem & { userId: string };

function readList<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? (value as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const getOrders = (userId: string): OrderHistoryItem[] =>
  readList<StoredOrder>("food-court-orders").filter(
    (order) => order.userId === userId,
  );

export const saveOrder = (
  userId: string,
  order: Omit<OrderHistoryItem, "id">,
): OrderHistoryItem => {
  const result: StoredOrder = {
    ...order,
    id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
  };
  writeList("food-court-orders", [
    result,
    ...readList<StoredOrder>("food-court-orders"),
  ]);
  return result;
};

export const getAddresses = (userId: string): SavedAddress[] =>
  readList<{ userId: string; address: SavedAddress }>("food-court-addresses")
    .filter((entry) => entry.userId === userId)
    .map((entry) => entry.address);

export const saveAddress = (userId: string, address: SavedAddress): void => {
  const addresses = readList<{ userId: string; address: SavedAddress }>(
    "food-court-addresses",
  ).filter((entry) => entry.userId !== userId);
  addresses.push({ userId, address });
  writeList("food-court-addresses", addresses);
};
