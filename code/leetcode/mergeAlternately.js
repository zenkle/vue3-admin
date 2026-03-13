// a长，以短的那个长度进行数据截取
// 将数据交替合并，最后将截取字符串加到最后
var mergeAlternately = function (word1, word2) {
  if (!word1) return word2;
  if (!word2) return word1;
  const length = Math.min(word1.length, word2.length);
  let str = "";
  for (let i = 0; i < length; i++) {
    str += word1[i] + word2[i];
  }
  let overflowStr = word1.substr(length) || word2.substr(length);
  return str + overflowStr;
};
let word1 = "abcd";
let word2 = "pq";
mergeAlternately(word1, word2);
