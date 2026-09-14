import { REPORT_TODAY, shiftDate } from "./analyticsData";
export interface DemoShop {
  id: string;
  name: string;
  code: string;
  region: "us" | "non_us";
  authorized: boolean;
}
export const DEMO_SHOPS: DemoShop[] = [
  {
    id: "shop-us-1",
    name: "Mengchang Beauty US",
    code: "USMC482091",
    region: "us",
    authorized: true,
  },
  {
    id: "shop-us-2",
    name: "Mengchang Living US",
    code: "USMC572140",
    region: "us",
    authorized: true,
  },
  {
    id: "shop-uk-1",
    name: "Mengchang Style UK",
    code: "GBMC283905",
    region: "non_us",
    authorized: false,
  },
  {
    id: "shop-us-3",
    name: "Mengchang Care US",
    code: "USMC963821",
    region: "us",
    authorized: false,
  },
];
export interface ShopOrder {
  id: string;
  shopId: string;
  timestamp: string;
  amount: number;
  refund: number;
  fee: number;
  status: string;
  settlement: string;
  payout: string;
  net: number;
}
export function createShopOrders(shops = DEMO_SHOPS): ShopOrder[] {
  return shops.flatMap((shop, s) =>
    Array.from({ length: 60 }, (_, d) =>
      Array.from({ length: 5 + ((d + s) % 7) }, (_, i) => {
        const n = d * 7 + i + s * 13,
          status = ["已完成", "待发货", "已发货", "未支付", "已取消", "已退款"][
            n % 6
          ];
        const amount = 1999 + ((n * 13) % 18) * 300,
          refund = status === "已退款" ? amount : 0;
        const paid = !["未支付", "已取消"].includes(status),
          fee = paid && !refund ? Math.round(amount * 0.08) : 0;
        return {
          id: `TT-${s + 1}-${String(d + 1).padStart(3, "0")}-${i + 1}`,
          shopId: shop.id,
          timestamp: `${shiftDate(REPORT_TODAY, -59 + d)}T${String((i * 3 + s) % 24).padStart(2, "0")}:25:00Z`,
          amount,
          refund,
          fee,
          status,
          settlement:
            !paid || refund
              ? "不结算"
              : status !== "已完成"
                ? "处理中"
                : n % 19 === 0
                  ? "失败"
                  : "已结算",
          payout:
            status !== "已完成" || refund
              ? "未付款"
              : n % 19 === 0
                ? "失败"
                : n % 7 === 0
                  ? "处理中"
                  : "已付款",
          net: paid ? amount - refund - fee : 0,
        };
      }),
    ).flat(),
  );
}
export const SHOP_ORDERS = createShopOrders();
export function shopDate(timestamp: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp));
  return `${parts.find((p) => p.type === "year")!.value}-${parts.find((p) => p.type === "month")!.value}-${parts.find((p) => p.type === "day")!.value}`;
}
export function shopTotals(rows: ShopOrder[]) {
  const sum = (
    filter: (row: ShopOrder) => boolean,
    key: "amount" | "net" | "refund",
  ) => rows.filter(filter).reduce((sum, row) => sum + row[key], 0) / 100;
  const count = (status: string) =>
    rows.filter((row) => row.status === status).length;
  return {
    orders: rows.length,
    amount: sum(() => true, "amount"),
    paid: sum((row) => !["未支付", "已取消"].includes(row.status), "amount"),
    unpaid: count("未支付"),
    unpaidAmount: sum((row) => row.status === "未支付", "amount"),
    cancelled: count("已取消"),
    cancelledAmount: sum((row) => row.status === "已取消", "amount"),
    refunded: count("已退款"),
    refund: sum(() => true, "refund"),
    net: sum(() => true, "net"),
    statementPaid: sum((row) => row.settlement === "已结算", "net"),
    statementProcessing: sum((row) => row.settlement === "处理中", "net"),
    statementFailed: sum((row) => row.settlement === "失败", "net"),
    payoutPaid: sum((row) => row.payout === "已付款", "net"),
    payoutProcessing: sum((row) => row.payout === "处理中", "net"),
    payoutFailed: sum((row) => row.payout === "失败", "net"),
  };
}
