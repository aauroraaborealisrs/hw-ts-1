type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  bigint: bigint;
  symbol: symbol;
  undefined: undefined;
  object: object;
  function: (...args: unknown[]) => unknown;
  array: unknown[];
  null: null;
  date: Date;
};

type Schema = Record<string, keyof TypeMap>;

type FromSchema<T extends Schema> = {
  [K in keyof T]: TypeMap[T[K]];
}; // ts сам подхватит литералы из схемы, если передать объект inline

function isValidType(value: unknown, expectedType: keyof TypeMap): boolean {
  switch (expectedType) {
    case "array":
      return Array.isArray(value);
    case "null":
      return value === null;
    case "date":
      return value instanceof Date;
    default:
      return typeof value === expectedType;
  }
}

function typedObject<T extends Schema>(schema: T): FromSchema<T> {
  const target = {} as FromSchema<T>;

  return new Proxy(target, {
    set(obj, prop, value, receiver) {
      if (typeof prop !== "string") {
        throw new TypeError(`Ключ "${String(prop)}" должен быть строкой`);
      }

      if (!(prop in schema)) {
        throw new TypeError(`Свойство "${String(prop)}" не описано в схеме`);
      }

      const expectedType = schema[prop];

      if (!isValidType(value, expectedType)) {
        throw new TypeError(
          `Свойство "${String(prop)}" должно быть типом ${expectedType}`,
        );
      }

      return Reflect.set(obj, prop, value, receiver);
    },
  });
}

//тесты

const profile = typedObject({
  name: "string",
  age: "number",
  isAdmin: "boolean",
});

// проверяем, что корректные значения спокойно записываются
profile.name = "Alice";
profile.age = 28;
profile.isAdmin = false;

console.log("Начальное состояние объекта:", profile);

// пробуем записать неправильный тип
try {
  profile.age = "twenty eight" as never;
} catch (err) {
  if (err instanceof TypeError) {
    console.warn("Поймали ошибку проверки типа:", err.message);
  } else {
    console.warn("Неожиданная ошибка:", err);
  }
}

// пытаемся добавить поле, которого нет в схеме
try {
  (profile as Record<string, unknown>).city = "Almaty";
} catch (err) {
  if (err instanceof TypeError) {
    console.warn("Попытка добавить неизвестное поле:", err.message);
  }
}

// проверяем повторное изменение значения
try {
  profile.name = "Kate";
  console.log("Имя изменилось:", profile.name);

  profile.name = 123 as never;
} catch (err) {
  if (err instanceof TypeError) {
    console.warn("Ошибка при повторной записи:", err.message);
  }
}
