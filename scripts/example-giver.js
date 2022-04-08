/**
 * {@link https://262.ecma-international.org/5.1/#sec-11.9.3}
 * {@link https://dorey.github.io/JavaScript-Equality-Table/}
 * @param x
 * @return {Object}
 */
function giveExamples(x) {
	handleSpecialCases(x);

	const type = typeof x;
	switch (type) {
		case "undefined":
			return {
				isInfinite: false,
				examples: [undefined, null]
			};
		case "number":
		case "bigint":
			return {
				isInfinite: false,
				examples: [x, String(x)]
			};
		case "boolean":
			throw Error(`${x} is another Boolean value other than true or false!?`);
		case "string":
			let parsed = tryParsingToNumber(x);
			if (parsed) {
				return {
					isInfinite: true,
					examples: [x, parsed].concat(generateWrappedArrayUpToNTimes(x, 10, String))
				};
			} else {
				return {
					isInfinite: true,
					examples: [x].concat(generateWrappedArrayUpToNTimes(x, 10, String))
				};
			}
		case "object":
			if (Array.isArray(x)) {
				return handleArray(x);
			} else {
				return handleObject(x);
			}
		case "symbol":
			return handleSymbol(x);
		default:
			// TODO: "function"
			const message = `Not implemented for type ${type}.`;

			console.error(message, x);
			throw Error(message);
	}
}

/**
 * @param x
 * @return {Object}
 */
function handleSpecialCases(x) {
	if (Number.isNaN(x)) {
		return {
			isInfinite: false,
			examples: []
		};
	}

	if (x === null) {
		return {
			isInfinite: false,
			examples: [undefined, null]
		};
	}

	if (x === false || x === 0) {
		return {
			isInfinite: true,
			examples: [
				false,
				0,
				"0",
				"",
				[],
				[0],
				["0"],
				[[]],
				[[0]],
				[["0"]],
				[[[]]],
				[[[0]]],
				[[["0"]]]
			]
		};
	}

	if (x === "0") {
		// TODO: add objects using String constructor
		return {
			isInfinite: true,
			examples: [
				false,
				0,
				"0",
				[0],
				["0"],
				[[0]],
				[["0"]],
				[[[0]]],
				[[["0"]]],
				[[[[0]]]],
				[[[["0"]]]]
			]
		};
	}

	if (x === true || x === 1) {
		return {
			isInfinite: true,
			examples: [
				true,
				1,
				"1",
				[1],
				["1"],
				[[1]],
				[["1"]],
				[[[1]]],
				[[["1"]]],
				[[[[1]]]],
				[[[["1"]]]]
			]
		};
	}

	if (x === "1") {
		// TODO: add objects using String constructor
		return {
			isInfinite: true,
			examples: [
				true,
				1,
				"1",
				[1],
				["1"],
				[[1]],
				[["1"]],
				[[[1]]],
				[[["1"]]],
				[[[[1]]]],
				[[[["1"]]]]
			]
		};
	}

	if (x === "") {
		// TODO: add objects using String constructor
		return {
			isInfinite: true,
			examples: [
				false,
				0,
				"",
				[],
				[[]],
				[[[]]],
				[[[[]]]],
				[[[[[]]]]],
				[[[[[[]]]]]],
				[[[[[[[]]]]]]],
				[[[[[[[[]]]]]]]]
			]
		};
	}
}

/**
 * @param {Array} array
 * @return {Object}
 */
function handleArray(array) {
	if (isNestedEmptyArray(array) || isNumberInNestedArray(0, array)) {
		return {
			isInfinite: false,
			examples: [false, 0, ""]
		};
	}
	if (isNumberInNestedArray(0, array)) {
		return {
			isInfinite: false,
			examples: [false, 0, "0"]
		};
	}
	if (isNumberInNestedArray(1, array)) {
		return {
			isInfinite: false,
			examples: [true, 1, "1"]
		};
	}

	return {
		isInfinite: false,
		examples: []
	};
}

/**
 * @param {Object} object
 * @return {Object}
 */
function handleObject(object) {
	const toPrimitive = object[Symbol.toPrimitive];
	if (typeof toPrimitive === "function") {
		try {
			const primitive = toPrimitive();
			return giveExamples(primitive);
		} catch (error) {
			console.trace("Failed to invoke Symbol.toPrimitive.", error);

			if (object instanceof Date) {
				return {
					isInfinite: true,
					examples: generateObjectWrappedArrayUpToNTimes(object, 10)
				};
			}

			// TODO: what else?
		}
	}

	return {
		isInfinite: false,
		examples: []
	};
}

/**
 * @param {Symbol} symbol
 * @return {Object}
 */
function handleSymbol(symbol) {
	return {
		isInfinite: true,
		examples: generateObjectWrappedArrayUpToNTimes(symbol, 10)
	};
}

/**
 * @param {String} string
 * @return {undefined|number}
 */
function tryParsingToNumber(string) {
	let parsed = parseInt(string);
	if (Number.isInteger(parsed)) {
		return parsed;
	}

	parsed = parseFloat(string);
	if (Number.isFinite(parsed)) {
		return parsed;
	}

	return undefined;
}

/**
 * @param {Array} array
 * @return {boolean}
 */
function isNestedEmptyArray(array) {
	if (!Array.isArray(array)) {
		return false;
	}
	if (array.length === 0) {
		return true;
	}
	if (array.length > 1) {
		return false;
	}

	const theOnlyElement = array[0];
	return isNestedEmptyArray(theOnlyElement);
}

/**
 * @param {Number} target
 * @param {Array} array
 * @return {boolean}
 */
function isNumberInNestedArray(target, array) {
	if (array.length !== 1) {
		return false;
	}

	const theOnlyElement = array[0];
	if (Array.isArray(theOnlyElement)) {
		return isNumberInNestedArray(target, theOnlyElement);
	} else {
		let parsed = parseFloat(theOnlyElement);
		return (parsed === target);
	}
}

/**
 * @param any
 * @param {Number} n
 * @param constructor
 * @return {Array}
 */
function generateWrappedArrayUpToNTimes(any, n, constructor) {
	const array = [];

	for (let i = 0; i <= n; i++) {
		array.push(wrapWithConstructorNTimes(any, i, constructor));
	}

	return array;
}

/**
 * @param any
 * @param {Number} n
 * @param {Function} constructor
 * @return {*|Object}
 */
function wrapWithConstructorNTimes(any, n, constructor) {
	if (n === 0) {
		return any;
	}

	const wrapped = constructor(any);

	if (n === 1) {
		return wrapped;
	}

	return wrapWithObjectNTimes(wrapped, n - 1);
}

/**
 * @param any
 * @param {Number} n
 * @return {Array}
 */
function generateObjectWrappedArrayUpToNTimes(any, n) {
	return generateWrappedArrayUpToNTimes(any, n, Object);
}

/**
 * @param any
 * @param {Number} n
 * @return {*|Object}
 */
function wrapWithObjectNTimes(any, n) {
	return wrapWithConstructorNTimes(any, n, Object);
}
