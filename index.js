// Test utils

const testBlock = (name) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};

const areEqual = (array1, array2) => {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return array1 === array2;
    }

    if (array1.length !== array2.length) {
        return false;
    }

    for (let i = 0; i < array1.length; i++) {
        if (!areEqual(array1[i], array2[i])) {
            return false;
        }
    }
    return true;
};

const test = (whatWeTest, actualResult, expectedResult) => {
    if (areEqual(actualResult, expectedResult)) {
        console.log(`[OK] ${whatWeTest}\n`);
    } else {
        console.error(`[FAIL] ${whatWeTest}`);
        console.debug('Expected:');
        console.debug(expectedResult);
        console.debug('Actual:');
        console.debug(actualResult);
        console.log('');
    }
};

// Functions

const getType = (value) => {
    return typeof value;
};

const getTypesOfItems = (arr) => {
    return arr.map((item) => getType(item));
};

const allItemsHaveTheSameType = (arr) => {
    return arr.every((el) => typeof el === typeof arr[0]);
};

const getRealType = (value) => {
    if (value === null) {
        return 'null';
    }
    if (Number.isNaN(value)) {
        return 'NaN';
    }

    if (typeof value === 'number' && !isFinite(value)) {
        return 'Infinity';
    }

    if (typeof value !== 'object') {
        return typeof value;
    }
    return value.constructor.name.toLowerCase();
};

const getRealTypesOfItems = (arr) => {
    return arr.map((value) => getRealType(value));
};

const everyItemHasAUniqueRealType = (arr) => {
    const realTypesArray = getRealTypesOfItems(arr);
    const uniqueRealTypes = new Set(realTypesArray);
    return realTypesArray.length === uniqueRealTypes.size;
};

const countRealTypes = (arr) => {
    const realTypesCounter = arr.reduce((acc, item) => {
        const realType = getRealType(item);
        if (!acc[realType]) {
            acc[realType] = 0;
        }
        acc[realType] += 1;
        return acc;
    }, {});

    return Object.entries(realTypesCounter).sort(([realType1], [realType2]) => realType1.localeCompare(realType2));
};

// Tests

testBlock('getType');

test('Boolean', getType(true), 'boolean');
test('Number', getType(123), 'number');
test('String', getType('whoo'), 'string');
test('Array', getType([]), 'object');
test('Object', getType({}), 'object');
test(
    'Function',
    getType(() => {}),
    'function'
);
test('Undefined', getType(undefined), 'undefined');
test('Null', getType(null), 'object');

testBlock('allItemsHaveTheSameType');

test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);

test('All values are strings', allItemsHaveTheSameType(['11', '12', '13']), true);

test('All values are strings but wait', allItemsHaveTheSameType(['11', new String('12'), '13']), false);

test('Values like a number', allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]), true);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
    true,
    0,
    '',
    [],
    {},
    () => {},
    undefined,
    null,
    NaN,
    Infinity,
    new Date(),
    /^/,
    new Set(),
    new Map(),
    Symbol(''),
    0n,
];

test('Check basic types', getTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'object',
    'object',
    'function',
    'undefined',
    'object',
    'number',
    'number',
    'object',
    'object',
    'object',
    'object',
    'symbol',
    'bigint',
]);

test('Check real types', getRealTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'array',
    'object',
    'function',
    'undefined',
    'null',
    'NaN',
    'Infinity',
    'date',
    'regexp',
    'set',
    'map',
    'symbol',
    'bigint',
]);

testBlock('everyItemHasAUniqueRealType');

test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);

test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, '123' === 123]), false);

test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);

testBlock('countRealTypes');

test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);
