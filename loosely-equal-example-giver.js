/**
 * {@link https://262.ecma-international.org/5.1/#sec-11.9.3}
 * {@link https://dorey.github.io/JavaScript-Equality-Table/}
 * @param {*} x
 * @return {Object}
 */
function giveExamples(x) {
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

	if (x === true || x === 1 || x === "1") {
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

	if (x === "") {
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
					isInfinite: false,
					examples: [x, parsed]
				};
			} else {
				return {
					isInfinite: false,
					examples: [x]
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
 * @param {*} input
 * @param {Number} [n]
 * @return {String}
 */
function format(input, n) {
	const type = typeof input;
	switch (type) {
		case "undefined":
			return "undefined";
		case "boolean":
		case "number":
		case "bigint":
		case "symbol":
			return String(input);
		case "string":
			return `"${input}"`;
		default:
			if (input === null) {
				return "null";
			}

			if (input instanceof Symbol) {
				return formatSymbol(input, n);
			}

			// TODO: deal with Function, Date, Infinity, NaN and nested Object
			return JSON.stringify(input);
	}
}

/**
 * @param {Symbol} symbol
 * @param {Number} n
 */
function formatSymbol(symbol, n) {
	let representation = "";

	for (let i = 0; i < n; i++) {
		representation += "Object(";
	}

	representation += input.toString();

	for (let i = 0; i < n; i++) {
		representation += ")";
	}

	representation += ";";

	return representation;
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
 * @param {Object} object
 * @return {Object}
 */
function handleObject(object) {
	const toPrimitive = object[Symbol.toPrimitive];
	if (typeof toPrimitive === "function") {
		const primitive = toPrimitive();
		return giveExamples(primitive);
	} else {
		return {
			isInfinite: false,
			examples: []
		};
	}
}

/**
 * @param {Symbol} symbol
 * @return {Object}
 */
function handleSymbol(symbol) {
	const first = Object(symbol);
	const second = Object(first);
	const third = Object(second);
	const forth = Object(third);
	const fifth = Object(forth);
	const sixth = Object(fifth);
	const seventh = Object(sixth);
	const eighth = Object(seventh);
	const ninth = Object(eighth);
	const tenth = Object(ninth);
	const eleventh = Object(tenth);

	return {
		isInfinite: true,
		examples: [first, second, third, forth, fifth, sixth, seventh, eighth, ninth, tenth, eleventh]
	};
}
