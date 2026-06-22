import {
  mockActivityLogEntries,
  mockAllocatedUsers,
  mockEntitlements,
  mockProducts,
} from '@/shared/mocks';
import type {
  ActivityLogEntry,
  AllocatedUser,
  Entitlement,
  Product,
  ProductEntitlementSummary,
} from '@/shared/types';

const resolveAsync = async <T>(value: T): Promise<T> => Promise.resolve(value);

export async function listProducts(): Promise<Product[]> {
  return resolveAsync(mockProducts);
}

export async function getProduct(productId: string): Promise<Product | undefined> {
  return resolveAsync(mockProducts.find((product) => product.id === productId));
}

export async function listEntitlements(): Promise<Entitlement[]> {
  return resolveAsync(mockEntitlements);
}

export async function listEntitlementsByProduct(productId: string): Promise<Entitlement[]> {
  return resolveAsync(mockEntitlements.filter((entitlement) => entitlement.productId === productId));
}

export async function getProductEntitlementSummary(
  productId: string
): Promise<ProductEntitlementSummary> {
  const entitlements = mockEntitlements.filter((entitlement) => entitlement.productId === productId);
  const purchasedQuantity = entitlements.reduce(
    (total, entitlement) => total + entitlement.purchasedQuantity,
    0
  );
  const allocatedQuantity = entitlements.reduce(
    (total, entitlement) => total + entitlement.allocatedQuantity,
    0
  );

  return resolveAsync({
    productId,
    purchasedQuantity,
    allocatedQuantity,
    availableQuantity: purchasedQuantity - allocatedQuantity,
  });
}

export async function listAllocatedUsers(productId: string): Promise<AllocatedUser[]> {
  return resolveAsync(mockAllocatedUsers.filter((user) => user.productId === productId));
}

export async function listActivityLog(productId: string): Promise<ActivityLogEntry[]> {
  return resolveAsync(mockActivityLogEntries.filter((entry) => entry.productId === productId));
}
