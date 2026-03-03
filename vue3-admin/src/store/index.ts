import { createPinia } from "pinia";

const store = createPinia();
export * from "./modules/user";

export { store };
