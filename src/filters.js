// src/filters.js

import { get } from './utils.js';

export function buildFilter(expression) {
  const tokens = tokenize(expression);
  const ast = parseTokens(tokens);
  return (obj) => evaluateAst(ast, obj);
}

// ------------------------
// Tokenizer
// ------------------------

function tokenize(str) {
  const regex = /\s*(=>|==|!=|<=|>=|&&|\|\||[()<>]|[a-zA-Z0-9_.]+|'[^']*'|"[^"]*"|\d+|true|false|null)\s*/g;
  const tokens = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    tokens.push(match[1]);
  }
  return tokens;
}

// ------------------------
// Parser
// ------------------------

function parseTokens(tokens) {
  let pos = 0;

  function parseExpression() {
    let left = parseTerm();
    while (tokens[pos] === '||') {
      const op = tokens[pos++];
      const right = parseTerm();
      left = { type: 'logical', op, left, right };
    }
    return left;
  }

  function parseTerm() {
    let left = parseFactor();
    while (tokens[pos] === '&&') {
      const op = tokens[pos++];
      const right = parseFactor();
      left = { type: 'logical', op, left, right };
    }
    return left;
  }

  function parseFactor() {
    if (tokens[pos] === '(') {
      pos++;
      const expr = parseExpression();
      if (tokens[pos++] !== ')') throw new Error('Expected )');
      return expr;
    }
    return parseComparison();
  }

  function parseComparison() {
    const left = tokens[pos++];
    const op = tokens[pos++];
    const right = tokens[pos++];

    return {
      type: 'comparison',
      op,
      left: isLiteral(left) ? parseLiteral(left) : { type: 'path', value: left },
      right: isLiteral(right) ? parseLiteral(right) : { type: 'path', value: right },
    };
  }

  return parseExpression();
}

// ------------------------
// Evaluator
// ------------------------

function evaluateAst(node, obj) {
  switch (node.type) {
    case 'logical':
      const left = evaluateAst(node.left, obj);
      const right = evaluateAst(node.right, obj);
      if (node.op === '&&') return left && right;
      if (node.op === '||') return left || right;
      throw new Error(`Unsupported logical operator: ${node.op}`);

    case 'comparison':
      const l = resolveValue(node.left, obj);
      const r = resolveValue(node.right, obj);
      switch (node.op) {
        case '==': return l == r;
        case '!=': return l != r;
        case '<': return l < r;
        case '>': return l > r;
        case '<=': return l <= r;
        case '>=': return l >= r;
        default: throw new Error(`Unknown comparison operator: ${node.op}`);
      }

    case 'path':
      return get(obj, node.value);

    case 'literal':
      return node.value;

    default:
      throw new Error(`Unknown AST node type: ${node.type}`);
  }
}

// ------------------------
// Helpers
// ------------------------

function isLiteral(token) {
  return /^-?\d+$/.test(token) || /^['"].*['"]$/.test(token) || /^(true|false|null)$/.test(token);
}

function parseLiteral(token) {
  if (/^['"]/.test(token)) return { type: 'literal', value: token.slice(1, -1) };
  if (token === 'true') return { type: 'literal', value: true };
  if (token === 'false') return { type: 'literal', value: false };
  if (token === 'null') return { type: 'literal', value: null };
  return { type: 'literal', value: Number(token) };
}

function resolveValue(node, obj) {
  if (node.type === 'literal') return node.value;
  if (node.type === 'path') return get(obj, node.value);
  throw new Error('Unknown value node');
}
