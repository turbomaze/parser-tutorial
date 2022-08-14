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
letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
`.replace(/ /g, '');

  // first, we parse our grammar with the
  const bootstrappedGrammar = parseEbnf(ebnfGrammar, ebnf);
  const bootstrappedGrammarString = JSON.stringify(
    bootstrappedGrammar,
    undefined,
    2
  );
  console.log('EBNF parsing itself via the bootstrapped grammar:');
  console.log(bootstrappedGrammarString);

  const dogfoodGrammar = parseEbnf(bootstrappedGrammar, ebnf);
  const dogfoodGrammarString = JSON.stringify(dogfoodGrammar, undefined, 2);
  console.log('\nEBNF parsing itself via the dogfooded grammar:');
  console.log(dogfoodGrammarString);

  console.log(
    '\nParse results match? ',
    bootstrappedGrammarString === dogfoodGrammarString
  );
}

main();
