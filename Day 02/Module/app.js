const calc = require("./calculator");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function userInput() {
  rl.question("Enter first number: ", (num1) => {
    rl.question("Enter second number: ", (num2) => {
      rl.question("Choose operation (add / sub / mul / div): ", (op) => {
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        let result;

        if (op === "add") result = calc.add(a, b);
        else if (op === "sub") result = calc.sub(a, b);
        else if (op === "mul") result = calc.mul(a, b);
        else if (op === "div") result = calc.div(a, b);
        else result = "Invalid operation";

        console.log("✅ Result:", result);

        // Ask if user wants to continue
        rl.question("Type 'exit' to quit or press Enter to continue: ", (input) => {
          if (input.toLowerCase() === "exit") {
            rl.close();
          } else {
            userInput(); // loop again
          }
        });
      });
    });
  });
}

userInput();
