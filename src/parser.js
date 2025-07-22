export function parseArgs(argv) {
  const flags = {
    map: [],
    filter: [],
    add: [],
    remove: [],
    pretty: false,
    preserve:false,
  };

  let inputFile = null;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      inputFile = arg;
    } else if (arg === '--map') {
      flags.map.push(argv[++i]);
    } 
     else if (arg === '--preserve') {
     flags.preserve = true;
    }
    else if (arg === '--filter') {
      flags.filter.push(...argv[++i].split(',').map(f => f.trim()));
    } else if (arg === '--add') {
      flags.add.push(argv[++i]);
    } else if (arg === '--remove') {
      flags.remove.push(...argv[++i].split(','));
    } else if (arg === '--output' || arg === '-o') {
      flags.output = argv[++i];
    } else if (arg === '--pretty') {
      flags.pretty = true;
    } else if (arg === '--help') {
      printHelp();
      process.exit(0);
    } else if (arg === '--version') {
      console.log('json-morph v0.1.0');
      process.exit(0);
    }
  }

  if (!inputFile) {
    console.error('❌ No input file provided.');
    printHelp();
    process.exit(1);
  }

  return { inputFile, flags };
}

function printHelp() {
  console.log(`
Usage:
  json-morph <input.json> [options]

Options:
  --map "a.b:new.path"         Remap JSON keys
  --filter "expression"        Logical filter(s) (ANDed or complex)
  --add "key:value"            Add new static fields
  --remove "field1,field2"     Remove fields
  --output, -o <file>          Output to file
  --pretty                     Pretty-print JSON output
  --help                       Show this message
  `);
}
