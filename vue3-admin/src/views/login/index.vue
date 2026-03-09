<template>
  <div class="login">
    <div class="login-container">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" clearable placeholder="请输入用户名">
            <template #prefix>
              <i-ep-user />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" clearable placeholder="请输入密码" type="password">
            <template #prefix>
              <i-ep-lock />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captchaCode">
          <div class="flex items-center">
            <el-input v-model="form.captchaCode" clearable placeholder="请输入验证码" />
            <div class="captcha-container" @click="getCaptcha">
              <img
                border-rd-4px
                w-full
                h-full
                block
                object-cover
                shadow="[0_0_0_1px_var(--el-border-color)_inset]"
                :src="captchaBase64"
                alt="captchaCode"
                title="点击刷新验证码"
                @error="getCaptcha"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin"> 登录 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import authApi from "@/api/auth";
import { useUserStore } from "@/store/modules/user";
import router from "@/router";
const form = ref({
  username: "admin",
  password: "123456",
  captchaCode: "",
  captchaId: "",
});

const rules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captchaCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});

const captchaBase64 = ref("");
const getCaptcha = () => {
  authApi.getCaptcha().then((res) => {
    form.value.captchaId = res.captchaId;
    captchaBase64.value = res.captchaBase64;
  });
};
const formRef = ref<ElFormInstance>();
const userStore = useUserStore();
const handleLogin = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) {
    return;
  }

  try {
    userStore.login(form.value).then(() => {
      router.push({ path: "/" });
    });
  } catch (error) {
    getCaptcha();
    console.log(error);
  }
};
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url("@/assets/icons/login-bg.svg") center/cover no-repeat;
}

.login-container {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 430px;
  padding: 180px 0;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  box-shadow:
    0 16px 48px rgba(22, 93, 255, 0.12),
    0 4px 16px rgba(22, 93, 255, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  backdrop-filter: blur(20px);
  transform: translateY(50%);
  animation: login-container 0.7s ease;
}

@keyframes login-container {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }

  to {
    opacity: 1;
  }
}
</style>
