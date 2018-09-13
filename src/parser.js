// statement:
//   keyword...
//
// expression:
//   IDN | literal | grouping | operation | function
//
// literal:
//   STR | NUM | "true" | "false"
//
// grouping:
//   GRP:"(" expression GRP:")"
//
// operation:
//   expression OPR expression

// Target result:
// [{ "ADD": [a, b] }, { "SUB": [a, b] }]
// [{ "ADD": [{ "MUL": [5, 2] }, b] }]

// 5 + 2 * 3
// print (5 + (2 * 3)) = 11
// NOT   ((5 + 2) * 3) = 21

let result = [{ ADD: [5, { MUL: [2, 3] }] }];

// token: "print",
// is type "key"?
// YES
// check rule for "print": expression
// loop through tokens until rule not satisfied

let opTable = {
  "+": "ADD",
  "-": "SUB",
  "*": "MUL",
  "/": "DIV"
};

class Parser {
  constructor(tokens) {
    this.program = [];
    this.pos = 0;
    this.tokens = tokens;
    this.grammar = [
      {
        print: "STR"
      }
    ];
  }

  parse() {
    let tokens = this.tokens;
    console.log(tokens);
    while (this.pos < tokens.length) {
      let line = {};
      let token = tokens[this.pos];

      // check for keyword
      if (this.isKeyword(token)) {
        line[token.lexeme] = tokens[this.pos + 1].lexeme;
        this.program.push(line);
      } else {
        this.program.push(this.parseExpression());
      }

      this.pos++;
    }
    console.log(JSON.stringify(this.program, 2, 2));
    return this.program;
  }

  isKeyword(token) {
    for (let i = 0; i < this.grammar.length; i++) {
      if (
        Object.keys(this.grammar[i])[0].toLowerCase() ===
        token.lexeme.toLowerCase()
      ) {
        return true;
      }
    }
  }

  isLiteral(token) {}

  // { "ADD": [{ "MUL": [5, 2] }, b] }
  parseExpression(lastExpression, precedence) {
    if (!lastExpression) {
      if (this.tokens[this.pos].type === "NUM") {
        var lastExpression = this.tokens[this.pos].lexeme;
      } else {
        return;
      }
    }

    let expression;
    while (
      this.tokens[this.pos + 1] &&
      this.tokens[this.pos + 1].type == "OPR"
    ) {
      let token = this.tokens[this.pos];
      let nextToken = this.tokens[this.pos + 1];
      let operator = nextToken.lexeme;

      let thisPrecedence;
      if ((operator == "+") | (operator == "-")) thisPrecedence = 1;
      if ((operator == "*") | (operator == "/")) thisPrecedence = 2;

      this.pos += 2;
      // if (precedence && thisPrecedence < precedence) {
      //   return Number(token.lexeme);
      // } else {
      return {
        [opTable[operator]]: [
          lastExpression,
          this.parseExpression(null, thisPrecedence)
        ]
      };
      // }
    }

    return Number(this.tokens[this.pos].lexeme);
  }

  parseExpressionOLD(precedence) {
    // console.log(token);
    while (this.tokens[this.pos + 1].type == "OPR") {
      let token = this.tokens[this.pos];
      let nextToken = this.tokens[this.pos + 1];
      // if (nextToken && nextToken.type == "OPR") {
      let thisPrecedence;
      if ((nextToken.lexeme == "+") | (nextToken.lexeme == "-"))
        thisPrecedence = 1;
      if ((nextToken.lexeme == "*") | (nextToken.lexeme == "/"))
        thisPrecedence = 2;
      if (precedence && thisPrecedence < precedence) {
        return Number(token.lexeme);
      } else {
        // console.log([precedence, thisPrecedence]);
        this.pos += 2;
        return {
          [opTable[nextToken.lexeme]]: [
            Number(token.lexeme),
            this.parseExpression(thisPrecedence)
          ]
        };
      }
    }
    return Number(token.lexeme);
    function isExpression() {
      return;
    }
  }
}

module.exports = tokens => new Parser(tokens).parse();
