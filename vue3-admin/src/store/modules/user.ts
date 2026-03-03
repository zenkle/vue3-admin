import { defineStore } from "pinia";
import authApi from "@/api/auth";
import type { LoginRequest } from "@/types/api/auth";

export const useUserStore = defineStore("user", () => {
  function login(loginRequest: LoginRequest) {
    return new Promise<void>((resolve, reject) => {
      authApi
        .login(loginRequest)
        .then((data) => {
          const { accessToken, refreshToken } = data;
          localStorage.setItem("ACCESS_TOKEN", accessToken);
          localStorage.setItem("REFRESH_TOKEN", refreshToken);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  return { login };
});

export default useUserStore;
