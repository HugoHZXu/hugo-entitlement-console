import {
  getEntitlementGraphqlUrl,
  getEntitlementRestUrl,
} from '@/shared/config/entitlement-service';
import { getCurrentOrRefreshIdentityAccessToken } from '@/shared/stores/identity-session-store';
import type {
  ActivityLogListInput,
  ActivityLogListResult,
  ActivityLogEntry,
  AllocatedUser,
  Entitlement,
  Product,
  ProductEntitlementSummary,
  UpdateProductUserAllocationsInput,
  UserAccessRow,
} from '@/shared/types';

type GraphqlError = {
  message?: string;
};

type GraphqlResponse<TData> = {
  data?: TData | null;
  errors?: GraphqlError[];
};

type EntitlementRequestScope = {
  organizationId?: string | null;
};

const PRODUCT_FIELDS = `
  id
  icon
  name
  provider
  description
  status
  supportedPlatforms
  usageDimensions {
    code
    name
    description
    unit
  }
  entitlementInfo {
    entitlementCode
    grantType
    allocationModel
    subscriberId
    subscriberAccountId
    renewalDate
  }
`;

const ENTITLEMENT_FIELDS = `
  id
  productId
  entitlementCode
  usageDimensionCode
  purchasedQuantity
  allocatedQuantity
  status
  startDate
  endDate
  source
`;

const PRODUCT_ENTITLEMENT_SUMMARY_FIELDS = `
  productId
  purchasedQuantity
  allocatedQuantity
  availableQuantity
`;

const ALLOCATED_USER_FIELDS = `
  id
  productId
  entitlementId
  seatQuantity
  name
  email
  department
  status
  allocatedAt
  sourceJobId
`;

const USER_ACCESS_ROW_FIELDS = `
  id
  productId
  entitlementId
  entitlementCode
  seatQuantity
  name
  email
  department
  status
  isAllocated
  allocatedAt
`;

const LOCALIZED_MESSAGE_FIELDS = `
  id
  defaultMessage
  values {
    key
    value
  }
`;

const ACTIVITY_LOG_ENTRY_FIELDS = `
  id
  productId
  productName
  entitlementId
  actor {
    type
    displayName
    email
  }
  target {
    type
    id
    name
  }
  action
  actionLabel {
    ${LOCALIZED_MESSAGE_FIELDS}
  }
  summary
  summaryMessage {
    ${LOCALIZED_MESSAGE_FIELDS}
  }
  quantityDelta
  result
  eventTime
`;

function normalizeMessage(message: unknown): string | undefined {
  if (typeof message === 'string') {
    return message;
  }

  if (Array.isArray(message)) {
    const items = message.filter((item): item is string => typeof item === 'string');

    return items.length > 0 ? items.join(', ') : undefined;
  }

  return undefined;
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const message = normalizeMessage((payload as { message?: unknown }).message);

    if (message) {
      return message;
    }

    const error = normalizeMessage((payload as { error?: unknown }).error);

    if (error) {
      return error;
    }
  }

  return fallback;
}

async function readJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function createJsonHeaders(headers?: HeadersInit): Promise<HeadersInit> {
  const accessToken = await getCurrentOrRefreshIdentityAccessToken();
  const jsonHeaders: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };

  return accessToken
    ? {
        ...jsonHeaders,
        Authorization: `Bearer ${accessToken}`,
      }
    : jsonHeaders;
}

async function requestGraphql<TData, TVariables extends Record<string, unknown>>(
  query: string,
  variables: TVariables
): Promise<TData> {
  const response = await fetch(getEntitlementGraphqlUrl(), {
    body: JSON.stringify({
      query,
      variables,
    }),
    headers: await createJsonHeaders(),
    method: 'POST',
  });
  const payload = (await readJsonResponse(response)) as GraphqlResponse<TData> | unknown;

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `GraphQL request failed with ${response.status}.`));
  }

  if (payload && typeof payload === 'object') {
    const graphqlPayload = payload as GraphqlResponse<TData>;

    if (graphqlPayload.errors?.length) {
      throw new Error(
        graphqlPayload.errors
          .map((error) => error.message)
          .filter((message): message is string => Boolean(message))
          .join('; ') || 'GraphQL request failed.'
      );
    }

    if (graphqlPayload.data) {
      return graphqlPayload.data;
    }
  }

  throw new Error('GraphQL response did not include data.');
}

async function requestRest<TData>(path: string, init: RequestInit): Promise<TData> {
  const response = await fetch(new URL(path, getEntitlementRestUrl()).toString(), {
    ...init,
    headers: await createJsonHeaders(init.headers),
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `REST request failed with ${response.status}.`));
  }

  return payload as TData;
}

function getOrganizationId(organizationId?: string | null): string {
  if (!organizationId) {
    throw new Error('Entitlement organization scope is not selected.');
  }

  return organizationId;
}

function createActivityLogInput(input: ActivityLogListInput = {}): ActivityLogListInput {
  const queryInput: ActivityLogListInput = {
    organizationId: getOrganizationId(input.organizationId),
  };
  const searchString = input.searchString?.trim();

  if (input.productId) {
    queryInput.productId = input.productId;
  }

  if (input.sortField) {
    queryInput.sortField = input.sortField;
  }

  if (input.sortDirection) {
    queryInput.sortDirection = input.sortDirection;
  }

  if (searchString) {
    queryInput.searchString = searchString;
  }

  if (input.pageNumber !== undefined && input.pageNumber !== null) {
    queryInput.pageNumber = input.pageNumber;
  }

  if (input.pageSize !== undefined && input.pageSize !== null) {
    queryInput.pageSize = input.pageSize;
  }

  return queryInput;
}

export async function listProducts(scope: EntitlementRequestScope = {}): Promise<Product[]> {
  const data = await requestGraphql<{ products: Product[] }, { organizationId: string }>(
    `
      query EntitlementProducts($organizationId: ID!) {
        products(organizationId: $organizationId) {
          ${PRODUCT_FIELDS}
        }
      }
    `,
    {
      organizationId: getOrganizationId(scope.organizationId),
    }
  );

  return data.products;
}

export async function getProduct(
  productId: string,
  scope: EntitlementRequestScope = {}
): Promise<Product | undefined> {
  const data = await requestGraphql<
    { product: Product | null },
    { organizationId: string; productId: string }
  >(
    `
      query EntitlementProduct($productId: ID!, $organizationId: ID!) {
        product(id: $productId, organizationId: $organizationId) {
          ${PRODUCT_FIELDS}
        }
      }
    `,
    {
      organizationId: getOrganizationId(scope.organizationId),
      productId,
    }
  );

  return data.product ?? undefined;
}

export async function listEntitlements(scope: EntitlementRequestScope = {}): Promise<Entitlement[]> {
  const products = await listProducts(scope);
  const entitlements = await Promise.all(
    products.map((product) => listEntitlementsByProduct(product.id, scope))
  );

  return entitlements.flat();
}

export async function listEntitlementsByProduct(
  productId: string,
  scope: EntitlementRequestScope = {}
): Promise<Entitlement[]> {
  const data = await requestGraphql<
    { entitlements: Entitlement[] },
    { organizationId: string; productId: string }
  >(
    `
      query EntitlementProductEntitlements($productId: ID!, $organizationId: ID!) {
        entitlements(productId: $productId, organizationId: $organizationId) {
          ${ENTITLEMENT_FIELDS}
        }
      }
    `,
    {
      organizationId: getOrganizationId(scope.organizationId),
      productId,
    }
  );

  return data.entitlements;
}

export async function getProductEntitlementSummary(
  productId: string,
  scope: EntitlementRequestScope = {}
): Promise<ProductEntitlementSummary> {
  const data = await requestGraphql<
    { productEntitlementSummary: ProductEntitlementSummary },
    { organizationId: string; productId: string }
  >(
    `
      query EntitlementProductSummary($productId: ID!, $organizationId: ID!) {
        productEntitlementSummary(productId: $productId, organizationId: $organizationId) {
          ${PRODUCT_ENTITLEMENT_SUMMARY_FIELDS}
        }
      }
    `,
    {
      organizationId: getOrganizationId(scope.organizationId),
      productId,
    }
  );

  return data.productEntitlementSummary;
}

export async function listAllocatedUsers(
  productId: string,
  scope: EntitlementRequestScope = {}
): Promise<AllocatedUser[]> {
  const data = await requestGraphql<
    { allocatedUsers: AllocatedUser[] },
    { organizationId: string; productId: string }
  >(
    `
      query EntitlementAllocatedUsers($productId: ID!, $organizationId: ID!) {
        allocatedUsers(productId: $productId, organizationId: $organizationId) {
          ${ALLOCATED_USER_FIELDS}
        }
      }
    `,
    {
      organizationId: getOrganizationId(scope.organizationId),
      productId,
    }
  );

  return data.allocatedUsers;
}

export async function listProductUserAccess(
  productId: string,
  scope: EntitlementRequestScope = {}
): Promise<UserAccessRow[]> {
  const data = await requestGraphql<
    { productUserAccess: UserAccessRow[] },
    { organizationId: string; productId: string }
  >(
    `
      query EntitlementProductUserAccess($productId: ID!, $organizationId: ID!) {
        productUserAccess(productId: $productId, organizationId: $organizationId) {
          ${USER_ACCESS_ROW_FIELDS}
        }
      }
    `,
    {
      organizationId: getOrganizationId(scope.organizationId),
      productId,
    }
  );

  return data.productUserAccess;
}

export async function updateProductUserAllocations({
  organizationId,
  productId,
  selectedUserIds,
}: UpdateProductUserAllocationsInput): Promise<UserAccessRow[]> {
  const resolvedOrganizationId = getOrganizationId(organizationId);
  const allocationPath = `/organizations/${encodeURIComponent(
    resolvedOrganizationId
  )}/products/${encodeURIComponent(productId)}/allocations`;

  return requestRest<UserAccessRow[]>(allocationPath, {
    body: JSON.stringify({
      selectedUserIds: Array.from(new Set(selectedUserIds)),
    }),
    method: 'PUT',
  });
}

export async function listActivityLogs(
  input: ActivityLogListInput = {}
): Promise<ActivityLogListResult> {
  const data = await requestGraphql<
    { activityLogs: ActivityLogListResult },
    { input: ActivityLogListInput }
  >(
    `
      query EntitlementActivityLogs($input: ActivityLogListInput) {
        activityLogs(input: $input) {
          totalElements
          items {
            ${ACTIVITY_LOG_ENTRY_FIELDS}
          }
        }
      }
    `,
    {
      input: createActivityLogInput(input),
    }
  );

  return data.activityLogs;
}

export async function listActivityLog(
  productId: string,
  scope: EntitlementRequestScope = {}
): Promise<ActivityLogEntry[]> {
  const input: ActivityLogListInput = {
    pageNumber: 0,
    pageSize: 50,
    productId,
    sortDirection: 'desc',
    sortField: 'eventTime',
  };

  if (scope.organizationId !== undefined) {
    input.organizationId = scope.organizationId;
  }

  const activityLogs = await listActivityLogs(input);

  return activityLogs.items;
}
