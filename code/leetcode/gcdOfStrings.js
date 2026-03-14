var gcdOfStrings = function (str1, str2) {
  if (str1 + str2 !== str2 + str1) return "";

  const len = gcd(str1.length, str2.length);
  return str1.substring(0, len);
};
// 欧几里得算法，获取两个值的最大公约数
function gcd(a, b) {
  while (b != 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}
console.log(gcdOfStrings("ABABAB", "ABAB"));
