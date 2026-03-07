import type { App } from "vue";
import { h, createApp } from "vue"; // 用于渲染虚拟节点

export default {
  install(app: App) {
    app.config.globalProperties.$myToast = function (message: string): void {
      const container = document.createElement("div");
      document.body.appendChild(container);

      const toastApp = createApp({
        render() {
          return h(
            "div",
            {
              style: {
                position: "fixed",
                top: "100px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "10px 20px",
                background: "#333",
                color: "#fff",
                borderRadius: "4px",
              },
            },
            message,
          );
        },
        mounted() {
          setTimeout(() => {
            toastApp.unmount();
            container.remove();
          }, 3000);
        },
      });
      toastApp.mount(container);
    };
  },
};
