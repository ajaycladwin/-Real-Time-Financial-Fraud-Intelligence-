const mongoose = require("mongoose");
require("dotenv").config();

const Account = require("./models/Account");
const Transaction = require("./models/Transaction");

const accountsData = [
  {
    accountId: "ACC001",
    name: "Arun Kumar",
    email: "arun.kumar@example.com",
    phone: "9876543210",
    accountType: "Savings",
    createdAt: new Date("2025-01-15T09:00:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  },
  {
    accountId: "ACC002",
    name: "Rahul Kumar",
    email: "rahul.kumar@example.com",
    phone: "9876543211",
    accountType: "Current",
    createdAt: new Date("2025-02-10T11:30:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  },
  {
    accountId: "ACC003",
    name: "Karthik Raj",
    email: "karthik.raj@example.com",
    phone: "9876543212",
    accountType: "Savings",
    createdAt: new Date("2025-03-05T14:15:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  },
  {
    accountId: "ACC004",
    name: "Daniel Joseph",
    email: "daniel.joseph@example.com",
    phone: "9876543213",
    accountType: "Savings",
    createdAt: new Date("2025-04-12T10:00:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  },
  {
    accountId: "ACC005",
    name: "Sanjay Kumar",
    email: "sanjay.kumar@example.com",
    phone: "9876543214",
    accountType: "Current",
    createdAt: new Date("2025-05-18T16:45:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  },
  {
    accountId: "ACC006",
    name: "Priya Thomas",
    email: "priya.thomas@example.com",
    phone: "9876543215",
    accountType: "Savings",
    createdAt: new Date("2025-06-22T08:20:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  },
  {
    accountId: "ACC007",
    name: "Maria Joseph",
    email: "maria.joseph@example.com",
    phone: "9876543216",
    accountType: "Savings",
    createdAt: new Date("2025-07-09T13:10:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  },
  {
    accountId: "ACC008",
    name: "Kevin Raj",
    email: "kevin.raj@example.com",
    phone: "9876543217",
    accountType: "Current",
    createdAt: new Date("2025-08-30T17:05:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  },
  // Account ACC009: Dedicated account for behavioral drift evaluation (CASE B)
  {
    accountId: "ACC009",
    name: "Vikrant Sharma",
    email: "vikrant.sharma@example.com",
    phone: "9876543218",
    accountType: "Savings",
    createdAt: new Date("2025-09-12T11:00:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  },
  // Accounts ACC010, ACC011, ACC012: Controlled Synthetic Network Test Cluster
  {
    accountId: "ACC010",
    name: "Deepa Nair",
    email: "deepa.nair@example.com",
    phone: "9876543220",
    accountType: "Savings",
    createdAt: new Date("2025-10-01T09:30:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  },
  {
    accountId: "ACC011",
    name: "Suresh Menon",
    email: "suresh.menon@example.com",
    phone: "9876543221",
    accountType: "Savings",
    createdAt: new Date("2025-10-05T14:20:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  },
  {
    accountId: "ACC012",
    name: "Rajesh Pillai",
    email: "rajesh.pillai@example.com",
    phone: "9876543222",
    accountType: "Current",
    createdAt: new Date("2025-10-10T16:45:00Z"),
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    status: "Active"
  }
];

// Base date for generating realistic timestamps
const baseDate = new Date("2026-03-20T10:00:00Z");

const transactionsData = [
  // --- Legitimate baseline transactions across various accounts ---
  {
    transactionId: "TXN1001",
    accountId: "ACC001",
    amount: 1450,
    timestamp: new Date(baseDate.getTime() + 10 * 60000),
    merchantId: "MER_SUPERMARKET_01",
    deviceId: "DEV_ARUN_MOBILE",
    location: "Coimbatore",
    paymentChannel: "UPI",
    items: ["Groceries", "Household Supplies"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1002",
    accountId: "ACC001",
    amount: 320,
    timestamp: new Date(baseDate.getTime() + 85 * 60000),
    merchantId: "MER_COFFEE_HOUSE",
    deviceId: "DEV_ARUN_MOBILE",
    location: "Coimbatore",
    paymentChannel: "UPI",
    items: ["Espresso", "Croissant"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1003",
    accountId: "ACC003",
    amount: 2800,
    timestamp: new Date(baseDate.getTime() + 140 * 60000),
    merchantId: "MER_FUEL_STATION_04",
    deviceId: "DEV_KARTHIK_PHONE",
    location: "Chennai",
    paymentChannel: "Debit Card",
    items: ["Petrol 30L"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1004",
    accountId: "ACC003",
    amount: 5400,
    timestamp: new Date(baseDate.getTime() + 320 * 60000),
    merchantId: "MER_AMAZON_RETAIL",
    deviceId: "DEV_KARTHIK_LAPTOP",
    location: "Chennai",
    paymentChannel: "Net Banking",
    items: ["Wireless Headphones", "USB-C Hub"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1005",
    accountId: "ACC006",
    amount: 980,
    timestamp: new Date(baseDate.getTime() + 210 * 60000),
    merchantId: "MER_MED_PLUS",
    deviceId: "DEV_PRIYA_IPHONE",
    location: "Kochi",
    paymentChannel: "UPI",
    items: ["First Aid Kit", "Vitamins"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1006",
    accountId: "ACC006",
    amount: 4200,
    timestamp: new Date(baseDate.getTime() + 450 * 60000),
    merchantId: "MER_FASHION_BOUTIQUE",
    deviceId: "DEV_PRIYA_IPHONE",
    location: "Kochi",
    paymentChannel: "Credit Card",
    items: ["Silk Scarf", "Handbag"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1007",
    accountId: "ACC008",
    amount: 15600,
    timestamp: new Date(baseDate.getTime() + 500 * 60000),
    merchantId: "MER_TECH_WORLD",
    deviceId: "DEV_KEVIN_MACBOOK",
    location: "Coimbatore",
    paymentChannel: "Net Banking",
    items: ["27-inch Monitor", "HDMI Cable"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1008",
    accountId: "ACC008",
    amount: 750,
    timestamp: new Date(baseDate.getTime() + 620 * 60000),
    merchantId: "MER_SWIGGY_FOOD",
    deviceId: "DEV_KEVIN_PIXEL",
    location: "Coimbatore",
    paymentChannel: "UPI",
    items: ["Dinner Delivery"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1009",
    accountId: "ACC001",
    amount: 890,
    timestamp: new Date(baseDate.getTime() + 720 * 60000),
    merchantId: "MER_BOOKSTORE_09",
    deviceId: "DEV_ARUN_MOBILE",
    location: "Coimbatore",
    paymentChannel: "UPI",
    items: ["Data Science Book"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1010",
    accountId: "ACC006",
    amount: 1200,
    timestamp: new Date(baseDate.getTime() + 840 * 60000),
    merchantId: "MER_SUPERMARKET_01",
    deviceId: "DEV_PRIYA_IPHONE",
    location: "Kochi",
    paymentChannel: "UPI",
    items: ["Organic Milk", "Fruits"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1011",
    accountId: "ACC003",
    amount: 650,
    timestamp: new Date(baseDate.getTime() + 900 * 60000),
    merchantId: "MER_RESTAURANT_PALACE",
    deviceId: "DEV_KARTHIK_PHONE",
    location: "Chennai",
    paymentChannel: "UPI",
    items: ["South Indian Thali"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1012",
    accountId: "ACC008",
    amount: 2200,
    timestamp: new Date(baseDate.getTime() + 1050 * 60000),
    merchantId: "MER_SPORTS_HUB",
    deviceId: "DEV_KEVIN_PIXEL",
    location: "Coimbatore",
    paymentChannel: "Credit Card",
    items: ["Badminton Racket", "Shuttlecocks"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1013",
    accountId: "ACC001",
    amount: 3400,
    timestamp: new Date(baseDate.getTime() + 1200 * 60000),
    merchantId: "MER_UTILITIES_BOARD",
    deviceId: "DEV_ARUN_MOBILE",
    location: "Coimbatore",
    paymentChannel: "Net Banking",
    items: ["Electricity Bill Payment"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1014",
    accountId: "ACC006",
    amount: 1850,
    timestamp: new Date(baseDate.getTime() + 1320 * 60000),
    merchantId: "MER_BEAUTY_SALON",
    deviceId: "DEV_PRIYA_IPHONE",
    location: "Kochi",
    paymentChannel: "Debit Card",
    items: ["Salon Care Package"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1015",
    accountId: "ACC003",
    amount: 1100,
    timestamp: new Date(baseDate.getTime() + 1440 * 60000),
    merchantId: "MER_CINEMA_COMPLEX",
    deviceId: "DEV_KARTHIK_PHONE",
    location: "Chennai",
    paymentChannel: "UPI",
    items: ["Movie Tickets", "Snacks"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },

  // --- Initial normal transactions for the 4 ring accounts (establishing initial activity) ---
  {
    transactionId: "TXN1016",
    accountId: "ACC002",
    amount: 1500,
    timestamp: new Date(baseDate.getTime() + 30 * 60000),
    merchantId: "MER_AMAZON_RETAIL",
    deviceId: "DEV_RAHUL_PERSONAL",
    location: "Bangalore",
    paymentChannel: "Credit Card",
    items: ["Ergonomic Mouse"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1017",
    accountId: "ACC004",
    amount: 2100,
    timestamp: new Date(baseDate.getTime() + 75 * 60000),
    merchantId: "MER_SUPERMARKET_01",
    deviceId: "DEV_DANIEL_PERSONAL",
    location: "Bangalore",
    paymentChannel: "UPI",
    items: ["Kitchen Groceries"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1018",
    accountId: "ACC005",
    amount: 1800,
    timestamp: new Date(baseDate.getTime() + 110 * 60000),
    merchantId: "MER_COFFEE_HOUSE",
    deviceId: "DEV_SANJAY_PERSONAL",
    location: "Mysore",
    paymentChannel: "UPI",
    items: ["Coffee Beans", "Mug"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1019",
    accountId: "ACC007",
    amount: 1250,
    timestamp: new Date(baseDate.getTime() + 160 * 60000),
    merchantId: "MER_BOOKSTORE_09",
    deviceId: "DEV_MARIA_PERSONAL",
    location: "Bangalore",
    paymentChannel: "Debit Card",
    items: ["Stationery Set"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },

  // =========================================================================
  // --- SIMULATED COORDINATED PATTERN (Ring: ACC002, ACC004, ACC005, ACC007) ---
  // Subtly linked by:
  // - Shared hardware: DEV_SHARED_KORAMANGALA_09 & DEV_SHARED_INDIRA_HUB
  // - Coordinated merchants: MER_DIGITAL_GOLD_88 & MER_CRYPTO_VAULT_99
  // - Unusually rapid sequence of liquid store tokens / vouchers
  // - Amounts structured just below typical alert thresholds (48,000 - 49,500)
  // - Synchronized timing window within 1-2 hours
  // =========================================================================
  {
    transactionId: "TXN2001",
    accountId: "ACC002",
    amount: 48500,
    timestamp: new Date(baseDate.getTime() + 1800 * 60000),
    merchantId: "MER_DIGITAL_GOLD_88",
    deviceId: "DEV_SHARED_KORAMANGALA_09",
    location: "Bangalore - Koramangala",
    paymentChannel: "UPI",
    items: ["Digital Gold Asset 5g", "Express Processing Voucher"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN2002",
    accountId: "ACC004",
    amount: 49200,
    timestamp: new Date(baseDate.getTime() + 1818 * 60000),
    merchantId: "MER_DIGITAL_GOLD_88",
    deviceId: "DEV_SHARED_KORAMANGALA_09",
    location: "Bangalore - Koramangala",
    paymentChannel: "UPI",
    items: ["Digital Gold Asset 5g", "Express Processing Voucher"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN2003",
    accountId: "ACC005",
    amount: 48900,
    timestamp: new Date(baseDate.getTime() + 1835 * 60000),
    merchantId: "MER_DIGITAL_GOLD_88",
    deviceId: "DEV_SHARED_KORAMANGALA_09",
    location: "Bangalore - Koramangala",
    paymentChannel: "UPI",
    items: ["Digital Gold Asset 5g", "Express Processing Voucher"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN2004",
    accountId: "ACC007",
    amount: 49500,
    timestamp: new Date(baseDate.getTime() + 1852 * 60000),
    merchantId: "MER_DIGITAL_GOLD_88",
    deviceId: "DEV_SHARED_KORAMANGALA_09",
    location: "Bangalore - Koramangala",
    paymentChannel: "UPI",
    items: ["Digital Gold Asset 5g", "Express Processing Voucher"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN2005",
    accountId: "ACC002",
    amount: 47800,
    timestamp: new Date(baseDate.getTime() + 1910 * 60000),
    merchantId: "MER_CRYPTO_VAULT_99",
    deviceId: "DEV_SHARED_INDIRA_HUB",
    location: "Bangalore - Indiranagar",
    paymentChannel: "Net Banking",
    items: ["Instant E-Voucher Series A", "Priority Ledger Token"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN2006",
    accountId: "ACC004",
    amount: 48100,
    timestamp: new Date(baseDate.getTime() + 1928 * 60000),
    merchantId: "MER_CRYPTO_VAULT_99",
    deviceId: "DEV_SHARED_INDIRA_HUB",
    location: "Bangalore - Indiranagar",
    paymentChannel: "Net Banking",
    items: ["Instant E-Voucher Series A", "Priority Ledger Token"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN2007",
    accountId: "ACC005",
    amount: 48750,
    timestamp: new Date(baseDate.getTime() + 1944 * 60000),
    merchantId: "MER_CRYPTO_VAULT_99",
    deviceId: "DEV_SHARED_INDIRA_HUB",
    location: "Bangalore - Indiranagar",
    paymentChannel: "Net Banking",
    items: ["Instant E-Voucher Series A", "Priority Ledger Token"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN2008",
    accountId: "ACC007",
    amount: 49100,
    timestamp: new Date(baseDate.getTime() + 1960 * 60000),
    merchantId: "MER_CRYPTO_VAULT_99",
    deviceId: "DEV_SHARED_INDIRA_HUB",
    location: "Bangalore - Indiranagar",
    paymentChannel: "Net Banking",
    items: ["Instant E-Voucher Series A", "Priority Ledger Token"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  // Additional legitimate filler transactions to guarantee volume and realism
  {
    transactionId: "TXN1020",
    accountId: "ACC001",
    amount: 1950,
    timestamp: new Date(baseDate.getTime() + 2050 * 60000),
    merchantId: "MER_SUPERMARKET_01",
    deviceId: "DEV_ARUN_MOBILE",
    location: "Coimbatore",
    paymentChannel: "UPI",
    items: ["Kitchen Ware"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1021",
    accountId: "ACC008",
    amount: 3100,
    timestamp: new Date(baseDate.getTime() + 2150 * 60000),
    merchantId: "MER_FUEL_STATION_04",
    deviceId: "DEV_KEVIN_PIXEL",
    location: "Coimbatore",
    paymentChannel: "Debit Card",
    items: ["Diesel 35L"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1022",
    accountId: "ACC003",
    amount: 520,
    timestamp: new Date(baseDate.getTime() + 2250 * 60000),
    merchantId: "MER_COFFEE_HOUSE",
    deviceId: "DEV_KARTHIK_PHONE",
    location: "Chennai",
    paymentChannel: "UPI",
    items: ["Cold Brew Coffee", "Cheesecake"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN1023",
    accountId: "ACC006",
    amount: 2750,
    timestamp: new Date(baseDate.getTime() + 2350 * 60000),
    merchantId: "MER_AMAZON_RETAIL",
    deviceId: "DEV_PRIYA_IPHONE",
    location: "Kochi",
    paymentChannel: "Credit Card",
    items: ["Desk Lamp", "Notebooks"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },

  // =========================================================================
  // --- CONTROL A: LEGITIMATE HIGH-VALUE BENCHMARK (Kevin Raj, ACC008) ---
  // =========================================================================
  {
    transactionId: "TXN3001",
    accountId: "ACC008",
    amount: 82500,
    timestamp: new Date(baseDate.getTime() + 2450 * 60000),
    merchantId: "MER_TECH_WORLD",
    deviceId: "DEV_KEVIN_MACBOOK",
    location: "Coimbatore",
    paymentChannel: "Net Banking",
    items: ["High-Performance Workstation Laptop", "Extended Hardware Warranty"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },

  // =========================================================================
  // --- CONTROL B: BEHAVIORAL DRIFT EVALUATION SCENARIO (ACC009 - Vikrant) ---
  // =========================================================================
  {
    transactionId: "TXN4001",
    accountId: "ACC009",
    amount: 1200,
    timestamp: new Date(baseDate.getTime() + 100 * 60000),
    merchantId: "MER_SUPERMARKET_01",
    deviceId: "DEV_VIKRANT_PHONE",
    location: "Pune",
    paymentChannel: "UPI",
    items: ["Weekly Groceries"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN4002",
    accountId: "ACC009",
    amount: 450,
    timestamp: new Date(baseDate.getTime() + 580 * 60000),
    merchantId: "MER_COFFEE_HOUSE",
    deviceId: "DEV_VIKRANT_PHONE",
    location: "Pune",
    paymentChannel: "UPI",
    items: ["Coffee", "Sandwich"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN4003",
    accountId: "ACC009",
    amount: 2100,
    timestamp: new Date(baseDate.getTime() + 1500 * 60000),
    merchantId: "MER_FUEL_STATION_04",
    deviceId: "DEV_VIKRANT_PHONE",
    location: "Pune",
    paymentChannel: "UPI",
    items: ["Petrol 20L"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN4004",
    accountId: "ACC009",
    amount: 1600,
    timestamp: new Date(baseDate.getTime() + 1860 * 60000),
    merchantId: "MER_AMAZON_RETAIL",
    deviceId: "DEV_VIKRANT_PHONE",
    location: "Pune",
    paymentChannel: "Net Banking",
    items: ["Desk Organizer"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN4005",
    accountId: "ACC009",
    amount: 38500,
    timestamp: new Date(baseDate.getTime() + 2500 * 60000),
    merchantId: "MER_UNFAMILIAR_ELECTRONICS",
    deviceId: "DEV_UNKNOWN_NEW_77",
    location: "Mumbai",
    paymentChannel: "Net Banking",
    items: ["Prepaid Game Gift Cards"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN4006",
    accountId: "ACC009",
    amount: 39200,
    timestamp: new Date(baseDate.getTime() + 2515 * 60000),
    merchantId: "MER_UNFAMILIAR_ELECTRONICS",
    deviceId: "DEV_UNKNOWN_NEW_77",
    location: "Mumbai",
    paymentChannel: "Net Banking",
    items: ["Express Digital Codes"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },

  // =========================================================================
  // --- CONTROLLED SYNTHETIC NETWORK TEST CLUSTER (ACC010, ACC011, ACC012) ---
  // Demonstrates multi-account infrastructure sharing independently from RING_001.
  // Shared Hardware: DEV_SHARED_KOCHI_KIOSK
  // Target Store: MER_QUICK_CASH_VOUCHERS
  // Synchronized Timing & Matched Amounts: ₹20,000 liquid voucher withdrawal
  // =========================================================================
  {
    transactionId: "TXN5000A",
    accountId: "ACC010",
    amount: 650,
    timestamp: new Date(baseDate.getTime() + 200 * 60000),
    merchantId: "MER_SUPERMARKET_01",
    deviceId: "DEV_DEEPA_PERSONAL",
    location: "Kochi",
    paymentChannel: "UPI",
    items: ["Groceries"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN5000B",
    accountId: "ACC011",
    amount: 720,
    timestamp: new Date(baseDate.getTime() + 350 * 60000),
    merchantId: "MER_COFFEE_HOUSE",
    deviceId: "DEV_SURESH_PERSONAL",
    location: "Kochi",
    paymentChannel: "UPI",
    items: ["Coffee & Snacks"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN5000C",
    accountId: "ACC012",
    amount: 890,
    timestamp: new Date(baseDate.getTime() + 480 * 60000),
    merchantId: "MER_BOOKSTORE_09",
    deviceId: "DEV_RAJESH_PERSONAL",
    location: "Kochi",
    paymentChannel: "Debit Card",
    items: ["Stationery"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN5001",
    accountId: "ACC010",
    amount: 24500,
    timestamp: new Date(baseDate.getTime() + 2600 * 60000),
    merchantId: "MER_QUICK_CASH_VOUCHERS",
    deviceId: "DEV_SHARED_KOCHI_KIOSK",
    location: "Kochi - Marine Drive",
    paymentChannel: "Net Banking",
    items: ["Prepaid Cash Voucher ₹20000", "Instant Terminal Fee"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN5002",
    accountId: "ACC011",
    amount: 24500,
    timestamp: new Date(baseDate.getTime() + 2612 * 60000),
    merchantId: "MER_QUICK_CASH_VOUCHERS",
    deviceId: "DEV_SHARED_KOCHI_KIOSK",
    location: "Kochi - Marine Drive",
    paymentChannel: "Net Banking",
    items: ["Prepaid Cash Voucher ₹20000", "Instant Terminal Fee"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  },
  {
    transactionId: "TXN5003",
    accountId: "ACC012",
    amount: 24500,
    timestamp: new Date(baseDate.getTime() + 2625 * 60000),
    merchantId: "MER_QUICK_CASH_VOUCHERS",
    deviceId: "DEV_SHARED_KOCHI_KIOSK",
    location: "Kochi - Marine Drive",
    paymentChannel: "Net Banking",
    items: ["Prepaid Cash Voucher ₹20000", "Instant Terminal Fee"],
    status: "Completed",
    riskScore: 0,
    riskLevel: "Low",
    riskReasons: [],
    recommendedAction: "Allow",
    isFraud: false
  }
];

const coordinatedPatternAccountIds = [
  "ACC002", "ACC004", "ACC005", "ACC007", // RING_001
  "ACC010", "ACC011", "ACC012"           // Controlled Synthetic Network Test Cluster
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    let accountsUpserted = 0;
    for (const acc of accountsData) {
      await Account.updateOne(
        { accountId: acc.accountId },
        { $set: acc },
        { upsert: true }
      );
      accountsUpserted++;
    }

    let transactionsUpserted = 0;
    for (const txn of transactionsData) {
      await Transaction.updateOne(
        { transactionId: txn.transactionId },
        { $set: txn },
        { upsert: true }
      );
      transactionsUpserted++;
    }

    console.log(`Number of accounts inserted/updated: ${accountsUpserted}`);
    console.log(`Number of transactions inserted/updated: ${transactionsUpserted}`);
    console.log(`Simulated coordinated pattern accounts: ${coordinatedPatternAccountIds.join(", ")}`);
    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error running seed script:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();
