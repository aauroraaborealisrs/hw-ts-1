"use strict";
//я придумала 2 варианта и не знаю какой лучше
//вариант 1
function promiseAll(promises //я почитала в доке, что он может принимать всякие iterable и thenable штуки и решила написать так
) {
    return new Promise((resolve, reject) => {
        const items = Array.from(promises); // чтобы можно было получить длину у непонятных стуктур 
        const results = [];
        let doneCount = 0;
        if (items.length === 0) {
            resolve([]);
            return;
        }
        items.forEach((promise, index) => {
            Promise.resolve(promise)
                .then((value) => {
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
function promiseAll2(// чтоб работало с as const
promises) {
    return new Promise((resolve, reject) => {
        const results = [];
        let completed = 0;
        if (promises.length === 0) {
            resolve(results);
            return;
        }
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then((value) => {
                results[index] = value;
                completed++;
                if (completed === promises.length) {
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
const thenableNumber = {
    then(resolve) {
        resolve(42);
    },
};
promiseAll([Promise.resolve(1), thenableNumber, 3]).then((result) => {
    console.log("test4 thenable:", result); // [1, 42, 3]
});
