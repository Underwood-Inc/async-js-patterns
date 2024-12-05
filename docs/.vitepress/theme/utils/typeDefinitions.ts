// Type definition for type information entries
export interface TypeInfo {
  description: string;
  type?: string;
  color?: {
    text: string;
    background: string;
  };
}

// Type definition for the type information record
export type TypeInfoRecord = Record<string, TypeInfo>;

// Define color schemes for different types
export const typeColors = {
  keyword: {
    text: '#c678dd',
    background: 'rgba(198, 120, 221, 0.1)',
  },
  primitive: {
    text: '#e5c07b',
    background: 'rgba(229, 192, 123, 0.1)',
  },
  'built-in': {
    text: '#56b6c2',
    background: 'rgba(86, 182, 194, 0.1)',
  },
};

// TypeScript keywords
export const typeScriptKeywords: TypeInfoRecord = {
  abstract: {
    type: 'keyword',
    color: typeColors.keyword,
    description:
      'Defines an abstract class or method that must be implemented by derived classes',
  },
  as: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Type assertion operator used for type casting',
  },
  async: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Declares an asynchronous function that returns a Promise',
  },
  await: {
    type: 'keyword',
    color: typeColors.keyword,
    description:
      'Pauses execution of an async function until a Promise is resolved',
  },
  break: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Exits the current loop or switch statement',
  },
  case: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Defines a case clause in a switch statement',
  },
  catch: {
    type: 'keyword',
    color: typeColors.keyword,
    description:
      'Defines a block of code to handle errors in a try-catch statement',
  },
  class: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Declares a class definition',
  },
  const: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Declares a constant variable that cannot be reassigned',
  },
  continue: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Skips the rest of the current loop iteration',
  },
  debugger: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Adds a breakpoint for debugging',
  },
  declare: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Declares ambient type definitions without implementation',
  },
  default: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Defines default behavior in a switch statement or export',
  },
  delete: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Removes a property from an object',
  },
  do: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Creates a loop that executes at least once',
  },
  else: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Defines alternative code block in an if statement',
  },
  enum: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Defines an enumerated type',
  },
  export: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Makes a declaration available for use in other modules',
  },
  extends: {
    type: 'keyword',
    color: typeColors.keyword,
    description:
      'Creates a class that inherits from another class or interface',
  },
  finally: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Defines code that always executes after try-catch',
  },
  for: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Creates a loop that repeats until a condition is met',
  },
  function: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Declares a function definition',
  },
  if: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Executes code conditionally based on a boolean expression',
  },
  implements: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Declares that a class implements an interface',
  },
  import: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Imports declarations from other modules',
  },
  in: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Checks if a property exists in an object',
  },
  instanceof: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Checks if an object is an instance of a specific class',
  },
  interface: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Declares a TypeScript interface type',
  },
  let: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Declares a block-scoped variable',
  },
  new: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Creates an instance of a class or object',
  },
  null: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Represents an intentional absence of any object value',
  },
  package: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Reserved for future use',
  },
  private: {
    type: 'keyword',
    color: typeColors.keyword,
    description:
      'Declares a class member that is only accessible within the class',
  },
  protected: {
    type: 'keyword',
    color: typeColors.keyword,
    description:
      'Declares a class member that is accessible within the class and its subclasses',
  },
  public: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Declares a class member that is accessible from anywhere',
  },
  return: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Specifies the value to be returned from a function',
  },
  static: {
    type: 'keyword',
    color: typeColors.keyword,
    description:
      'Declares a member that belongs to the class itself rather than instances',
  },
  super: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Refers to the parent class',
  },
  switch: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Creates a switch statement for multiple conditional branches',
  },
  this: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Refers to the current instance of a class or object',
  },
  throw: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Throws an error or exception',
  },
  try: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Defines a block of code to handle potential errors',
  },
  type: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Declares a type alias',
  },
  typeof: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Returns the type of a variable or expression',
  },
  var: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Declares a function-scoped or globally-scoped variable',
  },
  void: {
    type: 'keyword',
    color: typeColors.keyword,
    description:
      'Indicates that a function returns undefined or has no return value',
  },
  while: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Creates a loop that executes while a condition is true',
  },
  with: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Extends the scope chain for a statement (not recommended)',
  },
  yield: {
    type: 'keyword',
    color: typeColors.keyword,
    description: 'Pauses and resumes a generator function',
  },
};

// Re-export the original type information
export const primitiveTypes: TypeInfoRecord = {
  string: {
    type: 'primitive',
    color: typeColors.primitive,
    description: 'The string primitive type represents textual data',
  },
  number: {
    type: 'primitive',
    color: typeColors.primitive,
    description: 'The number primitive type represents numeric values',
  },
  boolean: {
    type: 'primitive',
    color: typeColors.primitive,
    description: 'The boolean primitive type represents true/false values',
  },
  bigint: {
    type: 'primitive',
    color: typeColors.primitive,
    description:
      'The bigint primitive type represents whole numbers larger than 2^53 - 1',
  },
  symbol: {
    type: 'primitive',
    color: typeColors.primitive,
    description:
      'The symbol primitive type represents a unique and immutable value',
  },
  undefined: {
    type: 'primitive',
    color: typeColors.primitive,
    description:
      'The undefined primitive type represents a variable that has not been assigned a value',
  },
  null: {
    type: 'primitive',
    color: typeColors.primitive,
    description:
      'The null primitive type represents the intentional absence of any object value',
  },
};

export const builtInObjects: TypeInfoRecord = {
  Array: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The Array object enables storing and manipulating collections of data',
  },
  Object: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The Object class represents the base class for all JavaScript objects',
  },
  Promise: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The Promise object represents the eventual completion of an asynchronous operation',
  },
  Map: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The Map object holds key-value pairs and remembers the original insertion order of the keys',
  },
  Set: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'The Set object lets you store unique values of any type',
  },
  WeakMap: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The WeakMap object is a collection of key/value pairs where keys must be objects and values can be arbitrary values',
  },
  WeakSet: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The WeakSet object lets you store weakly held objects in a collection',
  },
  Date: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'The Date object represents a single moment in time',
  },
  RegExp: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'The RegExp object is used for matching text with a pattern',
  },
  Error: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The Error object represents an error when runtime errors occur',
  },
  Math: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The Math object provides mathematical operations and constants',
  },
  JSON: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The JSON object contains methods for parsing and converting values to JSON',
  },
  Function: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The Function object provides methods for creating and executing functions',
  },
  Boolean: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'The Boolean object is an object wrapper for a boolean value',
  },
  String: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The String object is used to represent and manipulate text strings',
  },
  Number: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The Number object is a wrapper object allowing you to work with numerical values',
  },
  BigInt: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'The BigInt object represents whole numbers larger than 2^53 - 1',
  },
  Symbol: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'The Symbol object represents a unique identifier',
  },
  ArrayBuffer: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'A fixed-length raw binary data buffer',
  },
  SharedArrayBuffer: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'A fixed-length raw binary data buffer that can be shared between multiple threads',
  },
  DataView: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'Provides a low-level interface for reading and writing multiple number types in an ArrayBuffer',
  },
  Float32Array: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'A typed array of 32-bit floating point numbers',
  },
  Float64Array: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'A typed array of 64-bit floating point numbers',
  },
  Int8Array: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'A typed array of 8-bit signed integers',
  },
  Int16Array: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'A typed array of 16-bit signed integers',
  },
  Int32Array: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'A typed array of 32-bit signed integers',
  },
  Uint8Array: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'A typed array of 8-bit unsigned integers',
  },
  Uint8ClampedArray: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'A typed array of 8-bit unsigned integers clamped to 0-255',
  },
  Uint16Array: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'A typed array of 16-bit unsigned integers',
  },
  Uint32Array: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'A typed array of 32-bit unsigned integers',
  },
  Reflect: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'Provides methods for interceptable JavaScript operations',
  },
  Proxy: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'Used to define custom behavior for fundamental operations like property lookup, assignment, enumeration, and function invocation',
  },
  Atomics: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'Provides atomic operations as static methods for working with SharedArrayBuffer and ArrayBuffer objects',
  },
  Intl: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'Provides language sensitive string comparison, number formatting, and date and time formatting',
  },
  WebAssembly: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'Provides functionality for working with WebAssembly modules and instances',
  },
  AggregateError: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'Represents multiple errors wrapped in a single error',
  },
  EvalError: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'Indicates an error regarding the global eval() function',
  },
  RangeError: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'Indicates a numeric value that is outside the range of acceptable values',
  },
  ReferenceError: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'Indicates that an invalid reference has been detected',
  },
  SyntaxError: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'Indicates that a parsing error has occurred',
  },
  TypeError: {
    type: 'built-in',
    color: typeColors['built-in'],
    description:
      'Indicates that an operand or argument is incompatible with the expected type',
  },
  URIError: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'Indicates that a URI handling function was used incorrectly',
  },
  Infinity: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'Represents the mathematical Infinity value',
  },
  NaN: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'Represents "Not-A-Number" value',
  },
  globalThis: {
    type: 'built-in',
    color: typeColors['built-in'],
    description: 'References the global object regardless of the context',
  },
};

// Export combined type information
export const typeDefinitions: TypeInfoRecord = {
  ...typeScriptKeywords,
  ...primitiveTypes,
  ...builtInObjects,
  // Add other categories as needed
};
