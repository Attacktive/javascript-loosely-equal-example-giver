/**
 * @param input
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
				return formatNonPrimitive(input, n);
			}

			if (input instanceof String) {
				return formatNonPrimitive(input, n, () => `new ${input.constructor.name}("${input})"`);
			}

			if (input instanceof Date) {
				return formatNonPrimitive(input, n, () => `new ${input.constructor.name}()`);
			}

			// TODO: deal with Function, Date and nested Object
			return JSON.stringify(input);
	}
}

/**
 * @param any
 * @param {Number} n
 * @param {String|Function} [representation]
 */
function formatNonPrimitive(any, n, representation) {
	let formatted = "";

	for (let i = 0; i < n; i++) {
		formatted += "Object(";
	}

	if (typeof representation === "string") {
		formatted += representation;
	} else if (typeof representation === "function") {
		formatted += representation();
	} else {
		formatted += any.toString();
	}

	for (let i = 0; i < n; i++) {
		formatted += ")";
	}

	formatted += ";";

	return formatted;
}
