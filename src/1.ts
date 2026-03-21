function promiseAll<T>(
  promises: Iterable<T | PromiseLike<T>> //я почитала в доке, что он может принимать всякие iterable и thenable штуки и решила написать так
): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    const items = Array.from(promises); // чтобы превратить iterable в массив
    const results: T[] = [];
    let doneCount = 0;

    if (items.length === 0) {
      resolve([]);
      return;
    }

    items.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value: T) => {
          results[index] = value;
          doneCount++;

          if (doneCount === items.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);

promiseAll([p1, p2]).then(console.log); // [1, 2]

//порядок
const a = new Promise((res) => setTimeout(() => res("1"), 100));
const b = new Promise((res) => setTimeout(() => res("2"), 20));

promiseAll([a, b]).then((res) => {
  console.log("test2:", res);
});

promiseAll([1, 2, 3]).then((res) => {
  console.log("test3:", res); //[1, 2, 3]
});

promiseAll([]).then((res) => {
  console.log("test4:", res); //[]
});

const ok = Promise.resolve("ok");
const fail = Promise.reject("error"); 

promiseAll([ok, fail])
  .then((res) => console.log("test5:", res))
  .catch((err) => console.log("test5 error:", err)); //error

// Set тоже iterable, поэтому тоже работает
const setValues = new Set<number | Promise<number>>([
  Promise.resolve(10),
  20,
  Promise.resolve(30),
]);

promiseAll(setValues).then((res) => {
  console.log("set:", res); // [10, 20, 30]
});

// generator тоже iterable
function* generateValues(): Generator<number | Promise<number>> {
  yield Promise.resolve(7);
  yield 8;
  yield Promise.resolve(9);
}

promiseAll(generateValues()).then((res) => {
  console.log("generator:", res); // [7, 8, 9]
});

//map
const mapValues = new Map<string, number | Promise<number>>([
  ["a", Promise.resolve(100)],
  ["b", 200],
]);

promiseAll(mapValues.values()).then((res) => {
  console.log("map values:", res); // [100, 200]
});