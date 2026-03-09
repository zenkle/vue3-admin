export default {
  // 排除 test 目录下的所有文件
  "*.{js,ts}": (files) => {
    const filtered = files.filter((file) => !file.startsWith("test/") && !file.includes("/test/"));
    return [`eslint --fix ${filtered.join(" ")}`, `prettier --write ${filtered.join(" ")}`];
  },
  "*.{cjs,json}": (files) => {
    const filtered = files.filter((file) => !file.startsWith("test/") && !file.includes("/test/"));
    return [`prettier --write ${filtered.join(" ")}`];
  },
  "*.{vue,html}": (files) => {
    const filtered = files.filter((file) => !file.startsWith("test/") && !file.includes("/test/"));
    return [
      `eslint --fix ${filtered.join(" ")}`,
      `prettier --write ${filtered.join(" ")}`,
      `stylelint --fix ${filtered.join(" ")}`,
    ];
  },
  "*.{scss,css}": (files) => {
    const filtered = files.filter((file) => !file.startsWith("test/") && !file.includes("/test/"));
    return [`stylelint --fix ${filtered.join(" ")}`, `prettier --write ${filtered.join(" ")}`];
  },
  "*.md": (files) => {
    const filtered = files.filter((file) => !file.startsWith("test/") && !file.includes("/test/"));
    return [`prettier --write ${filtered.join(" ")}`];
  },
};
