Self-parsing EBNF
==

This project is a learning tool to help people learn more about parsing. The primary example showcased in this project is a hand-written abstract syntax tree (AST) for EBNF that is capable of parsing an EBNF describing EBNF into the identical AST.

## Example

Here's an example EBNF describing EBNF:

```
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
letter = 'a' | 'b' | ... | 'z'
```

Here's a code snippet of what the hand-written AST looks like:

```typescript
export const ebnfGrammar: Grammar = {
  root: new Repetition(new Identifier('definition')),

  definition: new Expression([
    new Identifier('identifier'),
    new Terminal('='),
    new Identifier('expression'),
    new Terminal('\n'),
  ]),
  ...
};
```

Using this bootstrapped AST, we can parse the example EBNF into a new AST. Then, we can use that new AST to parse the example EBNF again. If we've faithfully represented the EBNF in text form, and the parser is bug free, then the two ASTs should be identical.

## Usage

```bash
# install the deps for typescript/linting/etc
$ npm install

# compile the ts in watch mode
$ npm run compile:watch

# compare the bootstrapped EBNF AST to the dogfooded EBNF AST
$ node build/bin/index.js

EBNF parsing itself via the bootstrapped grammar:
{
  'root': 'Repetition(Identifier('definition'))',
  'definition': 'Expression([Identifier('identifier'),'=',Identifier('expression'),'n'])',
  'expression': 'Expression([Identifier('alternation'),Repetition(Expression([',',Identifier('alternation')]))])',
  'alternation': 'Expression([Identifier('factor'),Repetition(Expression(['|',Identifier('factor')]))])',
  'factor': 'Alternation([Identifier('group'),Identifier('repetition'),Identifier('terminal'),Identifier('identifier')])',
  'group': 'Expression(['(',Identifier('expression'),')'])',
  'repetition': 'Expression(['{',Identifier('expression'),'}'])',
  'identifier': 'Expression([Identifier('letter'),Repetition(Identifier('letter'))])',
  'terminal': 'Alternation([Expression([''',Identifier('character'),''']),Expression([''',Identifier('character'),'''])])',
  'character': 'Alternation([Identifier('letter'),'=','\n','|','[',']','{','}','(',')',',',''','''])',
  'letter': 'Alternation(['a','b', ..., 'z'])'
}

EBNF parsing itself via the dogfooded grammar:
{
  'root': 'Repetition(Identifier('definition'))',
  'definition': 'Expression([Identifier('identifier'),'=',Identifier('expression'),'n'])',
  'expression': 'Expression([Identifier('alternation'),Repetition(Expression([',',Identifier('alternation')]))])',
  'alternation': 'Expression([Identifier('factor'),Repetition(Expression(['|',Identifier('factor')]))])',
  'factor': 'Alternation([Identifier('group'),Identifier('repetition'),Identifier('terminal'),Identifier('identifier')])',
  'group': 'Expression(['(',Identifier('expression'),')'])',
  'repetition': 'Expression(['{',Identifier('expression'),'}'])',
  'identifier': 'Expression([Identifier('letter'),Repetition(Identifier('letter'))])',
  'terminal': 'Alternation([Expression([''',Identifier('character'),''']),Expression([''',Identifier('character'),'''])])',
  'character': 'Alternation([Identifier('letter'),'=','\n','|','[',']','{','}','(',')',',',''','''])',
  'letter': 'Alternation(['a','b', ..., 'z'])'
}

Parse results match?  true
```

## License

MIT License: https://igliu.mit-license.org/
