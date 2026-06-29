const enMessages = {
  app: {
    languageToggleLabel: 'Switch language',
    title: 'Hugo Entitlement Console',
  },
  accessState: {
    actions: {
      retry: 'Retry',
    },
    error: {
      message:
        'The demo identity context is unavailable. Confirm identity-service is running or retry the request.',
      pageTitle: 'Account unavailable',
      title: 'Unable to load account context',
    },
    loading: {
      message: 'Loading the selected demo account and entitlement organization scope.',
      pageTitle: 'Loading account',
      title: 'Checking entitlement access',
    },
    noAccounts: {
      message: 'identity-service did not return any switchable demo accounts.',
      pageTitle: 'No demo accounts',
      title: 'No demo accounts available',
    },
    noEntitlementScope: {
      message:
        'The selected demo account does not include an entitlement organization scope. Switch accounts to preview entitlement data.',
      pageTitle: 'No entitlement access',
      title: 'No entitlement organization available',
    },
    organizationUnavailable: {
      message:
        'The selected entitlement organization is not active. Choose another organization scope when one is available.',
      pageTitle: 'Organization unavailable',
      title: 'Selected organization is unavailable',
    },
    renewing: {
      message: 'Renewing the demo identity token before loading entitlement data.',
      pageTitle: 'Renewing session',
      title: 'Refreshing account context',
    },
  },
  identity: {
    account: {
      contextUnavailable: 'Account context unavailable.',
      current: 'Current',
      fallbackNotice: 'Selected account was unavailable. The default demo account is now active.',
      fallbackName: 'Demo account',
      listLabel: 'Demo accounts',
      loading: 'Loading account',
      multipleEntitlementAccess: '{count} entitlement organizations',
      noAccounts: 'No demo accounts are available from identity-service.',
      noEntitlementAccess: 'No entitlement organization access',
      openMenu: 'Open account menu',
      retry: 'Retry account context',
      retryMeta: 'Reload identity-service session',
      singleEntitlementAccess: 'Entitlement scope: {organization}',
      switchAccount: 'Switch account',
      switchAccountMeta: 'Choose a synthetic demo account',
      switchModalTitle: 'Switch demo account',
      unavailable: 'Account unavailable',
    },
    organization: {
      current: 'Current organization',
      fallbackName: 'Current organization',
      kind: {
        internal: 'Internal',
        public: 'Public',
        tenant: 'Tenant',
      },
      menuMeta: 'Applies to products, allocated users, and Activity Log.',
      menuTitle: 'Entitlement organization',
      noScope: 'No entitlement organization is available for this account.',
      placeholder: 'Select organization',
      scopeLabel: 'Entitlement organization',
      status: {
        active: 'Active',
        archived: 'Archived',
        inactive: 'Inactive',
      },
    },
  },
  nav: {
    activityLog: 'Activity Log',
    products: 'Products',
  },
  common: {
    status: {
      active: 'Active',
      failed: 'Failed',
      pending: 'Pending',
      retired: 'Retired',
      revoked: 'Revoked',
      scheduled: 'Scheduled',
      success: 'Success',
      unknown: 'Unknown',
    },
  },
  pages: {
    activityLog: {
      ariaLabel: 'Activity Log',
      empty: 'No activity records match the current query.',
      recordCount: '{count} activity records',
      searchAriaLabel: 'Search activity logs',
      searchPlaceholder: 'Search activity logs',
      title: 'Activity Log',
      titleInfo: 'Entitlement activity records loaded from the local portfolio service.',
    },
    allocatedUsers: {
      actions: {
        clear: 'Clear',
        submit: 'Submit',
      },
      ariaLabel: 'Allocated users',
      empty: 'No users are available for this product.',
      overCapacity: 'Selected users exceed available seats for {entitlementCode}.',
      searchAriaLabel: 'Search allocated users',
      searchEmpty: 'No users match the current search.',
      searchPlaceholder: 'Search allocated users',
      seatDelta: {
        assigned: '{count} {seatLabel} will be assigned',
        none: 'No pending changes',
        released: '{count} {seatLabel} will be released',
      },
      seatUnit: {
        plural: 'seats',
        singular: 'seat',
      },
      summary: {
        available: 'available',
        totalSeats: 'total seats',
        used: 'used',
      },
      title: 'Allocated Users',
      titleInfo: 'Manage named-user seat assignments for this product.',
    },
    productDetail: {
      activityAriaLabel: 'Product activity log',
      activityEmpty: 'No activity records for this product.',
      activityTitle: 'Activity Log',
      fallbackTitle: 'Product detail',
      fallbackTitleInfo:
        'Product information, entitlement allocation summary, and product-local activity.',
      fields: {
        allocationModel: 'Allocation model',
        dimensionApiName: 'Dimension API name',
        entitlementCode: 'Entitlement code',
        grantType: 'Grant type',
        provider: 'Provider',
        renewalDate: 'Renewal date',
        status: 'Status',
        subscriberAccount: 'Subscriber account',
      },
      manageUserAccess: 'Manage user access',
      productInfoAriaLabel: 'Product Information',
      productInfoTitle: 'Product Details',
      seatAllocationAriaLabel: 'Seat Allocation',
      seatLabels: {
        available: 'available',
        seats: 'seats',
        used: 'used',
      },
    },
    products: {
      empty: 'No products are currently granted to {organization}.',
      emptyDescription: 'No products are currently granted to {organization}.',
      emptyTitle: 'No product data',
      loading: 'Loading products...',
      title: 'Products',
      titleInfo:
        'Browse products that can be granted through licenses and allocated as organization seats.',
    },
  },
  product: {
    allocationModel: {
      namedUserAllocation: 'Named-user allocation',
      scheduledNamedUserAllocation: 'Scheduled named-user allocation',
    },
    grantType: {
      contractLicense: 'Contract license',
      scheduledLicense: 'Scheduled license',
      trialLicense: 'Trial license',
    },
    items: {
      accessMonitor: {
        description:
          'Access monitoring product scheduled to become available when the license term starts.',
        name: 'Access Monitor',
      },
      insightStudio: {
        description:
          'Analytics product granted through a contract license and allocated to named users.',
        name: 'Insight Studio',
      },
      workflowHub: {
        description: 'Workflow product with a separate license pool and named-user allocation.',
        name: 'Workflow Hub',
      },
    },
    provider: {
      licensingCatalog: 'Licensing Catalog',
    },
  },
  allocatedUsers: {
    columns: {
      allocatedAt: 'Allocated at',
      department: 'Department',
      entitlement: 'Entitlement',
      seats: 'Seats',
      status: 'Status',
      user: 'User',
    },
    notAllocated: 'Not allocated',
  },
  entitlementConsole: {
    activity: {
      action: {
        ENTITLEMENT_CREATED: 'Entitlement created',
        QUANTITY_UPDATED: 'Quantity updated',
        UNKNOWN: 'Unrecognized activity',
        USER_ALLOCATED: 'User allocated',
        USER_REVOKED: 'User revoked',
      },
      actor: {
        system: 'system',
      },
      column: {
        activity: 'Activity',
        actor: 'Actor',
        eventTime: 'Event time',
        product: 'Product',
        result: 'Result',
        type: 'Type',
      },
      result: {
        failed: 'Failed',
        pending: 'Pending',
        success: 'Success',
      },
      summary: {
        ENTITLEMENT_CREATED: '{targetName} was created for {productName} ({quantityText}).',
        QUANTITY_UPDATED: '{targetName} quantity changed by {quantityText}.',
        UNKNOWN: 'Unrecognized activity recorded for {targetName}.',
        USER_ALLOCATED: '{targetName} was allocated access to {productName} ({quantityText}).',
        USER_ALLOCATION_FAILED: 'Allocation attempt for {targetName} failed on {productName}.',
        USER_REVOKED: '{targetName} access was revoked from {productName} ({quantityText}).',
      },
    },
  },
};

export default enMessages;
