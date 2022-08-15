import {
  Alternation,
  Expression,
  Grammar,
  Group,
  Identifier,
  Repetition,
  Terminal,
} from './nodes';

/**
 * This is a handwritten, bootstrapped EBNF AST for the following grammar:
 *
 * root = { definition }
 * definition = identifier, '=', expression, '\n'
 * expression = alternation, { ',', alternation }
 * alternation = factor, { '|', factor }
 * factor = group | repetition | terminal | identifier
 * group = '(', expression , ')'
 * repetition = '{', expression, '}'
 * identifier = letter, { letter }
 * terminal = ("'", character, "'") | ('"', character, '"')
 * character = letter | '=' | '\n' | '|' | '[' | ']' | '{' | '}' | '(' | ')' | ',' | '"' | "'"
 * letter = 'a' | 'b' | ... | 'z'
 */
export const ebnfGrammar: Grammar = {
  root: new Repetition(new Identifier('definition')),
  definition: new Expression([
    new Identifier('identifier'),
    new Terminal('='),
    new Identifier('expression'),
    new Terminal('\n'),
  ]),
  expression: new Expression([
    new Identifier('alternation'),
    new Repetition(
      new Expression([new Terminal(','), new Identifier('alternation')])
    ),
  ]),
  alternation: new Expression([
    new Identifier('factor'),
    new Repetition(
      new Expression([new Terminal('|'), new Identifier('factor')])
    ),
  ]),
  factor: new Alternation([
    new Identifier('group'),
    new Identifier('repetition'),
    new Identifier('terminal'),
    new Identifier('identifier'),
  ]),
  group: new Expression([
    new Terminal('('),
    new Identifier('expression'),
    new Terminal(')'),
  ]),
  repetition: new Expression([
    new Terminal('{'),
    new Identifier('expression'),
    new Terminal('}'),
  ]),
  identifier: new Expression([
    new Identifier('letter'),
    new Repetition(new Identifier('letter')),
  ]),
  terminal: new Alternation([
    new Expression([
      new Terminal("'"),
      new Identifier('character'),
      new Terminal("'"),
    ]),
    new Expression([
      new Terminal('"'),
      new Identifier('character'),
      new Terminal('"'),
    ]),
  ]),
  character: new Alternation([
    new Identifier('letter'),
    ...'=\n|[]{}(),"\''.split('').map(character => new Terminal(character)),
  ]),
  letter: new Alternation(
    'abcdefghijklmnopqrstuvwxyz0123456789'
      .split('')
      .map(character => new Terminal(character))
  ),
};
