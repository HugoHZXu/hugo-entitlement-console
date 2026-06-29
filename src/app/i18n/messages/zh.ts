const zhMessages = {
  app: {
    languageToggleLabel: '切换语言',
    title: 'Hugo 产品授权管理控制台',
  },
  nav: {
    activityLog: '活动日志',
    products: '产品',
  },
  common: {
    status: {
      active: '启用',
      failed: '失败',
      pending: '待处理',
      retired: '已停用',
      revoked: '已撤销',
      scheduled: '已计划',
      success: '成功',
      unknown: '未知',
    },
  },
  pages: {
    activityLog: {
      ariaLabel: '活动日志',
      empty: '没有符合当前查询的活动记录。',
      recordCount: '{count} 条活动记录',
      searchAriaLabel: '搜索活动日志',
      searchPlaceholder: '搜索活动日志',
      title: '活动日志',
      titleInfo: '从本地 portfolio 服务加载的授权活动记录。',
    },
    allocatedUsers: {
      actions: {
        clear: '清除',
        submit: '提交',
      },
      ariaLabel: '已分配用户',
      empty: '此产品暂无可用用户。',
      overCapacity: '所选用户超出了 {entitlementCode} 的可用席位。',
      searchAriaLabel: '搜索已分配用户',
      searchEmpty: '没有符合当前搜索的用户。',
      searchPlaceholder: '搜索已分配用户',
      seatDelta: {
        assigned: '将分配 {count} 个席位',
        none: '没有待处理更改',
        released: '将释放 {count} 个席位',
      },
      seatUnit: {
        plural: 'seats',
        singular: 'seat',
      },
      summary: {
        available: '可用',
        totalSeats: '总席位',
        used: '已用',
      },
      title: '已分配用户',
      titleInfo: '管理此产品的实名用户席位分配。',
    },
    productDetail: {
      activityAriaLabel: '产品活动日志',
      activityEmpty: '此产品暂无活动记录。',
      activityTitle: '活动日志',
      fallbackTitle: '产品详情',
      fallbackTitleInfo: '产品信息、授权分配汇总和产品内活动。',
      fields: {
        allocationModel: '分配模式',
        dimensionApiName: '维度 API 名称',
        entitlementCode: '授权代码',
        grantType: '授权类型',
        provider: '提供方',
        renewalDate: '续订日期',
        status: '状态',
        subscriberAccount: '订阅账户',
      },
      manageUserAccess: '管理用户访问',
      productInfoAriaLabel: '产品信息',
      productInfoTitle: '产品详情',
      seatAllocationAriaLabel: '席位分配',
      seatLabels: {
        available: '可用',
        seats: '席位',
        used: '已用',
      },
    },
    products: {
      loading: '正在加载产品...',
      title: '产品',
      titleInfo: '浏览可通过许可证授予并分配为组织席位的产品。',
    },
  },
  product: {
    allocationModel: {
      namedUserAllocation: '实名用户分配',
      scheduledNamedUserAllocation: '计划实名用户分配',
    },
    grantType: {
      contractLicense: '合同许可证',
      scheduledLicense: '计划许可证',
      trialLicense: '试用许可证',
    },
    items: {
      accessMonitor: {
        description: '访问监控产品，将在许可证期限开始后开放使用。',
        name: 'Access Monitor',
      },
      insightStudio: {
        description: '通过合同许可证授予，并分配给实名用户的分析产品。',
        name: 'Insight Studio',
      },
      workflowHub: {
        description: '使用独立许可证池和实名用户分配模式的工作流产品。',
        name: 'Workflow Hub',
      },
    },
    provider: {
      licensingCatalog: '许可证目录',
    },
  },
  allocatedUsers: {
    columns: {
      allocatedAt: '分配时间',
      department: '部门',
      entitlement: '授权',
      seats: '席位',
      status: '状态',
      user: '用户',
    },
    notAllocated: '未分配',
  },
  entitlementConsole: {
    activity: {
      action: {
        ENTITLEMENT_CREATED: '创建授权',
        QUANTITY_UPDATED: '更新数量',
        UNKNOWN: '未识别活动',
        USER_ALLOCATED: '分配用户',
        USER_REVOKED: '撤销用户',
      },
      actor: {
        system: '系统',
      },
      column: {
        activity: '活动',
        actor: '操作者',
        eventTime: '事件时间',
        product: '产品',
        result: '结果',
        type: '类型',
      },
      result: {
        failed: '失败',
        pending: '待处理',
        success: '成功',
      },
      summary: {
        ENTITLEMENT_CREATED: '已为 {productName} 创建 {targetName}（{quantityText}）。',
        QUANTITY_UPDATED: '{targetName} 的席位数量变更 {quantityText}。',
        UNKNOWN: '已为 {targetName} 记录未识别活动。',
        USER_ALLOCATED: '{targetName} 已获得 {productName} 访问权限（{quantityText}）。',
        USER_ALLOCATION_FAILED: '尝试为 {targetName} 分配 {productName} 访问权限失败。',
        USER_REVOKED: '{targetName} 的 {productName} 访问权限已被撤销（{quantityText}）。',
      },
    },
  },
};

export default zhMessages;
