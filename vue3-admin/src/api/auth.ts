import request from "@/utils/request";
import type { CaptchaResponse, LoginRequest, LoginResponse } from "@/types/api/auth";
const AUTH_BASE_URL = "/api/v1/auth";

const authApi = {
  login: (data: LoginRequest) => {
    const payload: Record<string, any> = {
      username: data.username,
      password: data.password,
      captchaId: data.captchaId,
      captchaCode: data.captchaCode,
    };
    return request<any, LoginResponse>({
      url: `${AUTH_BASE_URL}/login`,
      method: "post",
      data: payload,
    });
  },
  getCaptcha: () => {
    return request<CaptchaResponse>({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get",
    });
  },
};
export default authApi;
