/**
 * {@link https://262.ecma-international.org/5.1/#sec-11.9.3}
 * {@link https://dorey.github.io/JavaScript-Equality-Table/}
 * @param {*} x
 * @return {Array}
 */
function giveExamples(x) {
	if (Number.isNaN(x)) {
		return [];
	}

	if (x === null || x === "0") {
		return [undefined, null];
	}

	if (x === true || x === 1 || x === "1") {
		return [true, 1, "1", [1]];
	}

	if (x === false || x === 0) {
		return [false, 0, "0", "", [], [0], [[]], [[[]]], [[[[]]]], [[[[[]]]]], [[[[[[]]]]]], [[[[[[[]]]]]]], [[[[[[[[]]]]]]]], [[[[[[[[[]]]]]]]]], [[[[[[[[[[]]]]]]]]]]];
	}

	if (x === "0") {
		return [false, 0, "0", [0]];
	}

	if (x === "") {
		return [false, 0, "", [], [[]]];
	}

	const type = typeof x;
	switch (type) {
		case "undefined":
			return [undefined, null];
		case "number":
		case "bigint":
			return [x, String(x)];
		case "boolean":
			throw Error(`${x} is another Boolean value other than true or false!?`);
		case "string":
			let parsed = tryParsingToNumber(x);
			if (parsed) {
				return [x, parsed];
			} else {
				return [x];
			}
		case "object":
			if (Array.isArray(x)) {
				return handleArray(x);
			} else {
				return handleObject(x);
			}
		default:
			// TODO: "symbol", "function"
			const message = `Not implemented for type ${type}.`;

			console.error(message, x);
			throw Error(message);
	}
}

/**
 * @param input
 * @return {String}
 */
function format(input) {
	const type = typeof input;
	switch (type) {
		case "undefined":
			return "undefined";
		case "boolean":
		case "number":
		case "bigint":
			return String(input);
		case "string":
			return `"${input}"`;
		default:
			if (input === null) {
				return "null";
			}

			// TODO: deal with undefined, Function, Symbol, Date, Infinity, NaN and nested Object
			return JSON.stringify(input);
	}
}

/**
 * @param {String} input
 * @return {undefined|number}
 */
function tryParsingToNumber(input) {
	let parsed = parseInt(input);
	if (Number.isInteger(parsed)) {
		return parsed;
	}

	parsed = parseFloat(input);
	if (Number.isFinite(parsed)) {
		return parsed;
	}

	return undefined;
}

function handleArray(input) {
	if (isNestedEmptyArray(input) || isNumberInNestedArray(0, input)) {
		return [false, 0, ""];
	}
	if (isNumberInNestedArray(0, input)) {
		return [false, 0, "0"];
	}
	if (isNumberInNestedArray(1, input)) {
		return [true, 1, "1"];
	}

	return [];
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

function handleObject(input) {
	throw Error("TODO: Unimplemented");
}
