import {ebnfGrammar, parseEbnf} from '../src';

function main() {
  const ebnf = `\
root = { definition }
definition = identifier, '=', expression, '\n'
expression = alternation, { ',', alternation }
alternation = factor, { '|', factor }
factor = group | repetition | terminal | identifier
group = '(', expression , ')'
repetition = '{', expression, '}'
identifier = letter, { letter }
terminal = ("'", character, "'") | ('"', character, '"')
character = letter | '=' | '\n' | '|' | '[' | ']' | '{' | '}' | '(' | ')' | ',' | '"' | "'"
letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
`.replace(/ /g, '');

  // first, we parse our grammar with the
  const originalGrammarString = JSON.stringify(ebnfGrammar, undefined, 2);
  console.log('Original EBNF AST');
  console.log(originalGrammarString);

  const bootstrappedGrammar = parseEbnf(ebnfGrammar, ebnf);
  const bootstrappedGrammarString = JSON.stringify(
    bootstrappedGrammar,
    undefined,
    2
  );
  console.log('\nEBNF parsing itself via the bootstrapped grammar:');
  console.log(bootstrappedGrammarString);

  console.log(
    '\nParse(1) results match? ',
    originalGrammarString === bootstrappedGrammarString
  );

  const dogfoodGrammar = parseEbnf(bootstrappedGrammar, ebnf);
  const dogfoodGrammarString = JSON.stringify(dogfoodGrammar, undefined, 2);
  console.log('\nEBNF parsing itself via the dogfooded grammar:');
  console.log(dogfoodGrammarString);

  console.log(
    '\nParse(2) results match? ',
    bootstrappedGrammarString === dogfoodGrammarString
  );
}

main();
