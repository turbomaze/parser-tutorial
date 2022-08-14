export class ParseError extends Error {
  constructor(structure: string, tokens: string[]) {
    super(`Could not parse ${structure}: ${tokens.join('')}`);
  }
}
