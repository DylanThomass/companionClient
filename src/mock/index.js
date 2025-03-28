import headImg1 from "@/assets/test/HeadImg-1.jpg";
import headImg2 from "@/assets/test/HeadImg-2.jpg";
import headImg3 from "@/assets/test/HeadImg-3.jpg";

/**
 * Mock 数据 - 店员用户
 * 用于模拟店员用户的基本信息、统计数据等
 */
export const MOCK_SELLER_USER = {
  id: 1001,
  openId: "o0Nbu7AX1_CpU3GSre5ShDs-SSPU",
  nickname: "治愈系店员",
  avatarUrl: headImg1,
  gender: 0, // 0-男 1-女
  province: "广东",
  city: "深圳",
  role: 2, // 1-普通用户 2-店员
  bio: "专注于倾听和陪伴，让每一次对话都充满温暖和治愈",
  birthday: "1995-01-01",
  // 用户基础统计
  stats: {
    balance: 888.88,
    coupons: 5,
    signInDays: 12,
    inviteCount: 8,
    todaySignIn: false,
  },
  // 店员特有统计
  seller: {
    pendingOrders: 3,
    todayIncome: 666,
    monthIncome: 8888,
    totalIncome: 66666,
    rating: 4.9,
    orderCount: 128,
    online: true,
  },
  // 用户标签
  tags: ["温暖贴心", "专业可靠", "倾听者"],
  // 等级信息
  level: {
    exp: 25000,
    title: "心屿灯塔",
    visualEffect: "灯塔光束特效",
  },
};

/**
 * Mock 数据 - 店员列表
 * 用于展示在大厅页面的店员卡片列表
 */
export const MOCK_SELLERS = [
  {
    id: 1,
    name: "治愈系店员",
    avatar: headImg1,
    rating: 4.8,
    level: 8,
    gender: 0,
    constellation: "天秤座",
    bio: "专注于倾听和陪伴，让每一次对话都充满温暖和治愈",
    tags: ["温暖贴心", "专业可靠", "倾听者", "治愈系"],
    online: true,
  },
  {
    id: 2,
    name: "暖心小姐姐",
    avatar: headImg2,
    rating: 4.9,
    level: 12,
    gender: 1,
    constellation: "双子座",
    bio: "一起分享生活中的点点滴滴，温暖相伴",
    tags: ["细心", "有耐心", "情感专家"],
    online: false,
  },
  {
    id: 3,
    name: "星河漫步",
    avatar: headImg3,
    rating: 4.7,
    level: 6,
    gender: 0,
    constellation: "射手座",
    bio: "愿做一道光，照亮你的世界",
    tags: ["知心", "理解", "暖男"],
    online: true,
  },
];

/**
 * Mock 数据 - 订单列表
 * 用于订单管理页面的不同状态订单展示
 */
export const MOCK_ORDERS = {
  // 待付款订单
  pending: [
    {
      id: "O2024030101",
      title: "情感咨询",
      status: "pending",
      price: 99.0,
      createTime: "2024-03-01 14:30",
      seller: {
        id: 1,
        name: "治愈系店员",
        avatar: headImg1,
      },
    },
  ],
  // 进行中订单
  processing: [
    {
      id: "O2024030102",
      title: "心理疏导",
      status: "processing",
      price: 158.0,
      createTime: "2024-03-01 15:00",
      seller: {
        id: 2,
        name: "暖心小姐姐",
        avatar: headImg2,
      },
    },
  ],
  // 已完成订单
  completed: [
    {
      id: "O2024030103",
      title: "情感咨询",
      status: "completed",
      price: 99.0,
      createTime: "2024-03-01 13:30",
      seller: {
        id: 3,
        name: "星河漫步",
        avatar: headImg3,
      },
    },
  ],
  // 申诉中订单
  appeal: [
    {
      id: "O2024030104",
      title: "心理咨询",
      status: "appeal",
      price: 128.0,
      createTime: "2024-03-01 16:30",
      seller: {
        id: 3,
        name: "星河漫步",
        avatar: headImg3,
      },
    },
  ],
};

/**
 * Mock 数据 - 用户等级配置
 * 用于展示用户等级、称号等信息
 */
export const MOCK_USER_LEVELS = [
  {
    level: 1,
    title: "新月初探",
    expRange: [0, 999],
    icon: "moon-o",
    theme: "新手引导",
    benefits: ["基础功能体验", "弯月幼苗图标"],
    visualEffect: "基础界面",
  },
  {
    level: 2,
    title: "萤火微光",
    expRange: [1000, 4999],
    icon: "fire-o",
    theme: "成长蜕变",
    benefits: ["优先匹配二星以上店员", "淡金色昵称边框", "流转萤火粒子特效"],
    visualEffect: "萤火粒子动效",
  },
  {
    level: 3,
    title: "星轨漫游",
    expRange: [5000, 19999],
    icon: "star-o",
    theme: "探索进阶",
    benefits: [
      "深夜时段（22-6点）服务8折",
      "专属闪光弹幕特效",
      "动态星空轨迹背景",
    ],
    visualEffect: "星轨动态背景",
  },
  {
    level: 4,
    title: "心屿灯塔",
    expRange: [20000, 49999],
    icon: "lighthouse",
    theme: "稳定守护",
    benefits: ["24h急速客服通道", "每月免费插队券3张", "光束旋转灯塔动效"],
    visualEffect: "灯塔光束特效",
  },
  {
    level: 5,
    title: "银河共鸣",
    expRange: [50000, Infinity],
    icon: "galaxy",
    theme: "巅峰成就",
    benefits: [
      "年度消费返现5%",
      "定制星座纪念品",
      "隐藏版高阶店员可见",
      "全息星云环绕效果",
    ],
    visualEffect: "星云全息特效",
  },
];

/**
 * 用户等级计算函数
 * @param {number} exp - 用户经验值
 * @returns {Object} 用户等级信息
 */
export const calculateUserLevel = (exp) => {
  const level = MOCK_USER_LEVELS.find(
    (l) => exp >= l.expRange[0] && exp <= l.expRange[1]
  );
  return {
    ...level,
    currentExp: exp,
    nextLevelExp: level.expRange[1] + 1,
    progress: Math.min(
      ((exp - level.expRange[0]) / (level.expRange[1] - level.expRange[0])) *
        100,
      100
    ),
  };
};

export const MOCK_USER_VIP_INFO = {
  vipLevel: 1,
  experience: 1000,
  expNext: 1500,
};

// 用户相关 mock 数据
export const MOCK_USER = {
  id: 7,
  nickname: "Dylan",
  signature: null,
  avatarUrl:
    "https://avatar-12.oss-cn-shanghai.aliyuncs.com/26d3e6fa-c264-41_image.png",
  phone: null,
  status: "0",
  city: "天津市",
  province: "天津市",
  country: "",
  sex: 0,
};

export const MOCK_SELLER = {
  ...MOCK_USER,
  role: 2,
  nickname: "测试店员",
  tags: ["专业", "热情"],
  MOCK_USER_VIP_INFO,
};

export const MOCK_USER_OTHER_INFO = {
  signature: "这是mock的个性签名",
  currentIdentity: 0,
  accumulatedExperience: 0.0,
  consecutiveSignInDays: 8,
  validInvitations: 6,
  unlockedBenefits: "这是mock的解锁福利",
  behaviorFingerprint: "这是mock的行为指纹",
  constellation: "这是mock的星座",
  balance: 999,
  couponCount: 10,
};

export const MOCK_SYSTEM_TAGS = [
  { id: 1, tag: "温柔" },
  { id: 2, tag: "耐心" },
  { id: 3, tag: "专业" },
  { id: 4, tag: "热情" },
  { id: 5, tag: "幽默" },
  { id: 6, tag: "细心" },
];

export const MOCK_USER_TAGS = [1, 2]; // 用户已选择的标签 ID

// 店员相关 mock 数据
export const MOCK_SELLER_LIST = {
  total: 5,
  list: [
    {
      id: 10002,
      name: "测试店员1",
      avatar: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
      rating: 4.8,
      praiseRate: 98,
      tags: ["专业", "热情"],
      online: true,
    },
    // ... 更多店员数据
  ],
};

export const MOCK_SELLER_DETAIL = {
  id: 10002,
  name: "测试店员1",
  avatar: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
  rating: 4.8,
  praiseRate: 98,
  tags: ["专业", "热情"],
  online: true,
  bio: "专业心理咨询师，擅长情感咨询",
  orderCount: 128,
  commentCount: 256,
};

// 用户统计数据 mock
export const MOCK_USER_STATS = {
  balance: 888.88,
  coupons: 5,
  inviteCount: 3,
  todaySignIn: false,
};

// 统一的 mock 响应格式
export const createMockResponse = (data) => data;

// 模拟延迟
export const mockDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
