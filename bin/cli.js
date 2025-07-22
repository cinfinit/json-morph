#!/usr/bin/env node

import fs from 'fs';
import { parseArgs } from '../src/parser.js';
import { transformJson } from '../src/transform.js';

const argv = process.argv.slice(2);
const { inputFile, flags } = parseArgs(argv);

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Input file not found: ${inputFile}`);
  process.exit(1);
}

const inputJson = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const outputJson = transformJson(inputJson, flags);

const output = flags.pretty
  ? JSON.stringify(outputJson, null, 2)
  : JSON.stringify(outputJson);

if (flags.output) {
  fs.writeFileSync(flags.output, output);
  console.log(`✅ Output written to ${flags.output}`);
} else {
  console.log(output);
}
