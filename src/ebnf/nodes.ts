import {AstNode} from './ast';
import {ParseError} from './exceptions';

export type Grammar = {[identifier: string]: ParseUnit};

type ParseResult = {node: AstNode; remainingTokens: string[]};
type Term = Alternation | Factor;
type Factor = Group | Repetition | Terminal | Identifier;

class ParseUnit {
  logging: boolean;

  constructor() {
    this.logging = false;
  }

  get name() {
    return this.constructor.name;
  }

  parse(grammar: Grammar, tokens: string[]): ParseResult {
    try {
      const result = this._parse(grammar, tokens);
      return result;
    } catch (err) {
      throw new ParseError(this.name, tokens);
    }
  }

  _parse(grammar: Grammar, tokens: string[]): ParseResult {
    throw new Error();
  }

  toJSON() {
    return this.name;
  }
}

export class Expression extends ParseUnit {
  constructor(public readonly terms: Term[]) {
    super();
  }

  _parse(grammar: Grammar, tokens: string[]): ParseResult {
    const nodes = [];

    for (const term of this.terms) {
      const {node, remainingTokens} = term.parse(grammar, tokens);
      nodes.push(node);
      tokens = remainingTokens;
    }

    return {node: {type: 'expression', ast: nodes}, remainingTokens: tokens};
  }

  toJSON() {
    return `${this.name}([${this.terms.map(term => term.toJSON()).join(',')}])`;
  }
}

export class Alternation extends ParseUnit {
  constructor(public readonly factors: Factor[]) {
    super();
  }

  _parse(grammar: Grammar, tokens: string[]): ParseResult {
    for (const factor of this.factors) {
      try {
        return factor.parse(grammar, tokens);
      } catch (err) {
        // pass
      }
    }

    throw new Error();
  }

  toJSON(): string {
    return `${this.name}([${this.factors
      .map(factor => factor.toJSON())
      .join(',')}])`;
  }
}

export class Group extends ParseUnit {
  constructor(public readonly expression: ParseUnit) {
    super();
  }

  _parse(grammar: Grammar, tokens: string[]): ParseResult {
    return this.expression.parse(grammar, tokens);
  }
}

export class Repetition extends ParseUnit {
  constructor(public readonly expression: ParseUnit) {
    super();
  }

  _parse(grammar: Grammar, tokens: string[]): ParseResult {
    const nodes = [];
    try {
      while (tokens.length > 0) {
        const {node, remainingTokens} = this.expression.parse(grammar, tokens);
        nodes.push(node);
        tokens = remainingTokens;
      }
    } catch (err) {
      // pass
    }

    return {node: {type: 'repetition', ast: nodes}, remainingTokens: tokens};
  }

  toJSON() {
    try {
      return `${this.name}(${this.expression.toJSON()})`;
    } catch (err) {
      return `${this.name}(${JSON.stringify(this.expression)})`;
    }
  }
}

export class Identifier extends ParseUnit {
  constructor(public readonly identifier: string) {
    super();
  }

  get name() {
    return `${super.name}(${JSON.stringify(this.identifier)})`;
  }

  _parse(grammar: Grammar, tokens: string[]): ParseResult {
    const reference = grammar[this.identifier];
    if (!reference) {
      throw new Error();
    }

    const {node, remainingTokens} = reference.parse(grammar, tokens);
    return {
      node: {type: 'identifier', identifier: this.identifier, ast: node},
      remainingTokens,
    };
  }
}

export class Terminal extends ParseUnit {
  constructor(public readonly character: string) {
    super();
  }

  get name() {
    return JSON.stringify(this.character);
  }

  _parse(grammar: Grammar, tokens: string[]): ParseResult {
    if (tokens.length === 0 || tokens[0] !== this.character) {
      throw new Error();
    }

    return {
      node: {type: 'terminal', ast: this.character},
      remainingTokens: tokens.slice(1),
    };
  }
}
