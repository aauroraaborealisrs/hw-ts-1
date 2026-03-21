// по таске было, что тип строка или число

type PrimitiveArg = string | number;

// перегрузка 1 по ТЗ
function memoize<A extends PrimitiveArg[], R>(fn: (...args: A) => R): (...args: A) => R;

// перегрузка 2 общий вариант
function memoize<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R;

function memoize<A extends unknown[], R>(fn: (...args: A) => R) {
  const RESULT = Symbol("result");
  const root = new Map<unknown, unknown>();

  return function (this: unknown, ...args: A): R {
    let current: Map<unknown, unknown> = root;

    for (const arg of args) {
      if (!current.has(arg)) {
        current.set(arg, new Map());
      }
      current = current.get(arg) as Map<unknown, unknown>;
    }

    if (current.has(RESULT)) {
      console.log("привет из кэша");
      return current.get(RESULT) as R;
    }

    const result = fn.apply(this, args);
    current.set(RESULT, result);

    return result;
  };
}

//тесты для первой версии

const add = (a: number, b: number): number => {
  console.log("считаю сумму");
  return a + b;
};

const joinWords = (a: string, b: string): string => {
  console.log("склеиваю строки");
  return `${a}-${b}`;
};

const mixed = (name: string, count: number): string => {
  console.log("формирую строку");
  return `${name}:${count}`;
};

const memoAdd = memoize(add);
const memoJoinWords = memoize(joinWords);
const memoMixed = memoize(mixed);

// проверка с числами
console.log("Первый вызов add:", memoAdd(2, 3));
console.log("Второй вызов add с теми же аргументами:", memoAdd(2, 3));
console.log("Третий вызов add с другими аргументами:", memoAdd(10, 5));

// проверка со строками
console.log("Первый вызов joinWords:", memoJoinWords("hello", "world"));
console.log("Второй вызов joinWords с теми же аргументами:", memoJoinWords("hello", "world"));
console.log("Третий вызов joinWords с другими аргументами:", memoJoinWords("ts", "memo"));

// проверка со смешанными аргументами
console.log("Первый вызов mixed:", memoMixed("items", 7));
console.log("Второй вызов mixed с теми же аргументами:", memoMixed("items", 7));
console.log("Третий вызов mixed с другими аргументами:", memoMixed("users", 3));


//тесты для второй версии

// объект как аргумент
const describeUser = (user: { name: string; age: number }): string => {
  console.log("формирую описание пользователя");
  return `${user.name} (${user.age})`;
};

const memoDescribeUser = memoize(describeUser);

console.log("Первый вызов describeUser:", memoDescribeUser({ name: "Anna", age: 25 }));
console.log("Второй вызов describeUser:", memoDescribeUser({ name: "Anna", age: 25 }));
console.log("Третий вызов describeUser:", memoDescribeUser({ name: "Max", age: 30 }));

// массив как аргумент
const sumArray = (numbers: number[]): number => {
  console.log("считаю сумму массива");
  return numbers.reduce((acc, item) => acc + item, 0);
};

const memoSumArray = memoize(sumArray);

console.log("Первый вызов sumArray:", memoSumArray([1, 2, 3]));
console.log("Второй вызов sumArray:", memoSumArray([1, 2, 3]));
console.log("Третий вызов sumArray:", memoSumArray([5, 5, 5]));

// смешанные аргументы
const buildMessage = (
  user: { name: string },
  tags: string[],
  isAdmin: boolean
): string => {
  console.log("собираю сообщение");
  return `${user.name}: ${tags.join(", ")} | admin=${isAdmin}`;
};

const memoBuildMessage = memoize(buildMessage);

console.log(
  "Первый вызов buildMessage:",
  memoBuildMessage({ name: "Kate" }, ["ts", "proxy"], true),
);

console.log(
  "Второй вызов buildMessage:",
  memoBuildMessage({ name: "Kate" }, ["ts", "proxy"], true),
);

console.log(
  "Третий вызов buildMessage:",
  memoBuildMessage({ name: "Bob" }, ["memo"], false),
);

// проверка работы с this
const calculator = {
  base: 100,

  calc(this: { base: number }, value: number): number {
    console.log("считаю через this");
    return this.base + value;
  },
};

calculator.calc = memoize(calculator.calc);

console.log("Первый вызов calc:", calculator.calc(5));
console.log("Второй вызов calc:", calculator.calc(5));
console.log("Третий вызов calc:", calculator.calc(10));