import {
  Alternation,
  Expression,
  Grammar,
  Identifier,
  Repetition,
  Terminal,
} from './nodes';

export type AstNode = {type: string; identifier?: string | null; ast: any};

// this function converts the raw AST produced by parsing
// into a domain-aware AST that can be used for interpreting
export function parseEbnfAst(node: AstNode): any {
  const {type, identifier, ast} = node;

  // identifiers
  if (identifier === 'root') {
    const expression = parseEbnfAst(ast);
    const grammar: Grammar = {};
    for (const term of expression.terms) {
      grammar[term.terms[0].identifier] = term.terms[2];
    }
    return grammar;
  } else if (identifier === 'definition') {
    return parseEbnfAst(ast);
  } else if (identifier === 'expression') {
    return parseRepeatedUnit(node, Expression);
  } else if (identifier === 'alternation') {
    return parseRepeatedUnit(node, Alternation);
  } else if (identifier === 'factor') {
    return parseEbnfAst(ast);
  } else if (identifier === 'group') {
    const expression = parseEbnfAst(ast);
    return expression.terms[1];
  } else if (identifier === 'repetition') {
    const expression = parseEbnfAst(ast);
    return new Repetition(expression.terms[1]);
  } else if (identifier === 'identifier') {
    const expression = parseEbnfAst(ast);
    const terminals = [expression.terms[0], ...expression.terms[1].terms];
    return new Identifier(
      terminals.map(terminal => terminal.character).join('')
    );
  } else if (identifier === 'terminal') {
    const expression = parseEbnfAst(ast);
    return expression.terms[1];
  } else if (identifier === 'character') {
    return parseEbnfAst(ast);
  } else if (identifier === 'letter') {
    return parseEbnfAst(ast);
  }

  // types
  else if (type === 'expression') {
    if (ast.length === 1) {
      return parseEbnfAst(ast[0]);
    } else {
      return new Expression(ast.map(parseEbnfAst));
    }
  } else if (type === 'repetition') {
    return new Expression(ast.map(parseEbnfAst));
  } else if (type === 'terminal') {
    return new Terminal(ast);
  }
}

function parseRepeatedUnit(
  node: AstNode,
  NodeType: typeof Expression | typeof Alternation
) {
  const {ast} = node;
  const expression = parseEbnfAst(ast);
  const terms = [expression.terms[0]];
  for (const term of expression.terms[1].terms) {
    terms.push(term.terms[1]);
  }

  if (terms.length === 1) {
    return terms[0];
  } else {
    return new NodeType(terms);
  }
}
