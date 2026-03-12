"use strict";
// по таске было, что тип строка или число
function memoize(fn) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log("из кэша");
            return cache.get(key);
        }
        const result = fn.apply(this, args); // apply возвращает unknown поэтому кастую
        cache.set(key, result);
        return result;
    };
}
// тут я опять занялась самодеятельностью и решила попытаться сделать более широкий вариант
function memoize2(fn) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log("из кэша");
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}
