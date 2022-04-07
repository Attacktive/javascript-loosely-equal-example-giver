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
