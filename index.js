function run() {
	const input = document.querySelector("#input");
	const xEvaluatedTo = document.querySelector("#x-evaluated-to");
	const output = document.querySelector("#output");

	const toEval = `x = ${input.value};`;
	console.debug("toEval", toEval);

	let x;
	let result;

	try {
		eval(toEval);

		xEvaluatedTo.textContent = `let x = ${x}`;

		const examples = giveExamples(x);
		result = examples.map(example => `x == ${format(example)}`).join("\n");

		output.classList.remove("error");
	} catch (error) {
		console.error(error);

		xEvaluatedTo.textContent = "let x;";
		result = error.stack;

		output.classList.add("error");
	}

	output.value = result;
}

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
		return [false, 0, "0", "", [], [[]], [0]];
	}

	if (x === "0") {
		return [false, 0, "0", [0]];
	}

	if (x === "") {
		return [false, 0, "", [], [[]]];
	}

	// TODO: [[[]]], [[[[]]]], ...
	if (x === [] || x === [[]]) {
		return [false, 0, ""];
	}

	// TODO: [[0]], [[[0]]], ...
	if (x === [0]) {
		return [false, 0, "0"];
	}

	// // TODO: [[1]], [[[1]]], ...
	if (x === [1]) {
		return [true, 1, "1"];
	}

	const type = typeof x;
	switch (type) {
		case "undefined":
			return [undefined, null];
		case "number":
		case "bigint":
			return [x, String(x)];
		case "boolean":
			throw Error(`${x} is another Boolean value other than true or false!?`)
		default:
			// TODO: "object", "symbol", "function"
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
			// object, symbol, function... Am I OK with all of these?
			if (input === null) {
				return "null";
			}

			if (input === []) {
				return "[]";
			}

			return input.toString();
	}
}
