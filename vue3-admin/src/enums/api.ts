export const ApiCode = {
  SUCCESS: "00000",
} as const;

// 类型推导
export type ApiCodeType = (typeof ApiCode)[keyof typeof ApiCode];
