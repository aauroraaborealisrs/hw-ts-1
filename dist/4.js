"use strict";
// function typedObject(schema) {
//   const target = {};
//   return new Proxy(target, {
//     set(obj, prop, value, receiver) {
//       if (!(prop in schema)) {
//         throw new TypeError(`Свойство "${String(prop)}" не описано в схеме`);
//       }
//       const expectedType = schema[prop];
//       if (typeof value !== expectedType) {
//         throw new TypeError(
//           `Свойство "${String(prop)}" должно быть типом ${expectedType}`,
//         );
//       }
//       return Reflect.set(obj, prop, value, receiver);
//     },
//   });
// }
// const user = typedObject({
//   name: "string",
//   age: "number",
// });
