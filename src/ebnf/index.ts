import {Grammar, Identifier} from './nodes';
import {ParseError} from './exceptions';
import {parseEbnfAst} from './ast';

export {ebnfGrammar} from './bootstrappedGrammar';

export function parseEbnf(grammar: Grammar, x: string): Grammar {
  const ast = parse(grammar, x);
  return parseEbnfAst(ast);
}

export function parse(grammar: Grammar, x: string): any {
  const tokens = x.split('');
  const {node, remainingTokens} = new Identifier('root').parse(grammar, tokens);
  if (remainingTokens.length > 0) {
    throw new ParseError('root', remainingTokens);
  }

  return node;
}
