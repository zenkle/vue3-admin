const cloneDeep = (obj) => {
  let content = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] == "object") {
      content[key] = cloneDeep(obj[key]);
    } else {
      content[key] = obj[key];
    }
  });
  return content;
};
let obj = {
  name: "pq",
  info: {
    sex: "woman",
    age: 18,
  },
};
const obj1 = cloneDeep(obj);
obj.info.age = "aa";
console.log(obj1);
