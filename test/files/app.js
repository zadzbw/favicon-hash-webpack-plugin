const flatten = arr => arr.reduce((prev, curr) => prev.concat(Array.isArray(curr) ? flatten(curr) : curr), []);

const a = [1, [2, [11, 12, [13, 14], 15]], 3, [4, 5, [6, 7, [8, 9]]], 10];

const b = flatten(a);

console.log(b);
