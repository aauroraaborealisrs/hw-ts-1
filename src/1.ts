//я придумала 2 варианта и не знаю какой лучше

//вариант 1
function promiseAll<T>(
  promises: Iterable<T | PromiseLike<T>> //я почитала в доке, что он может принимать всякие iterable и thenable штуки и решила написать так
): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    const items = Array.from(promises); // чтобы можно было получить длину у непонятных стуктур 
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

//вариант 2

function promiseAll2<T extends readonly unknown[]>( // чтоб работало с as const
  promises: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }> { // убрать промисы для типа
  return new Promise((resolve, reject) => {
    const results: unknown[] = [];
    let completed = 0;

    if (promises.length === 0) {
      resolve(results as any);
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
          completed++;

          if (completed === promises.length) {
            resolve(results as any);
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


const thenableNumber = {
  then(resolve: (value: number) => void) {
    resolve(42);
  },
} as PromiseLike<number>;
  
promiseAll([Promise.resolve(1), thenableNumber, 3]).then((result) => {
  console.log("test4 thenable:", result); // [1, 42, 3]
});


//тесты для второго варианта


const p11 = Promise.resolve(1);
const p21 = Promise.resolve(2);

promiseAll2([p1, p2]).then(console.log); // [1, 2]

//порядок
const a1 = new Promise((res) => setTimeout(() => res("1"), 100));
const b1 = new Promise((res) => setTimeout(() => res("2"), 20));

promiseAll2([a, b]).then((res) => {
  console.log("test2:", res);
});

promiseAll2([1, 2, 3]).then((res) => {
  console.log("test3:", res); //[1, 2, 3]
});

promiseAll2([]).then((res) => {
  console.log("test4:", res); //[]
});

const ok2 = Promise.resolve("ok");
const fail2 = Promise.reject("error"); 

promiseAll2([ok2, fail2])
  .then((res) => console.log("test5:", res))
  .catch((err) => console.log("test5 error:", err)); //error


const thenableNumber2 = {
  then(resolve: (value: number) => void) {
    resolve(42);
  },
} as PromiseLike<number>;
  
promiseAll2([Promise.resolve(1), thenableNumber2, 3]).then((result) => {
  console.log("test4 thenable:", result); // [1, 42, 3]
});