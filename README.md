# 🦎 json-morph [![NPM version](https://img.shields.io/npm/v/json-morph.svg?style=flat)](https://www.npmjs.com/package/json-morph) [![NPM downloads](https://img.shields.io/npm/dm/json-morph.svg?style=flat)](https://npmjs.org/package/json-morph) 


**Transform JSON like a boss.**  
Filter it. Reshape it. Clean it. Remix it. All from your terminal.

> _"Why mutate your JSON by hand when you can morph it like a shapeshifter?"_

---

## ✨ What is `json-morph`?

`json-morph` is a command-line tool and API that helps you **transform JSON data** using simple, expressive flags.

- 🧠 Filter using logical expressions (`age > 18 && status == 'active'`)
- 🔁 Map keys to new paths (`user.name` → `fullName`)
- ➕ Add static fields (`role:admin`)
- ❌ Remove sensitive fields (`password`, `secret`)
- 💅 Pretty-print or export to a new file

Perfect for quick one-liners, data munging, CLI pipelines, config transforms, and replacing brittle `jq` scripts for common tasks.

---

## 🚀 Installation

```bash
npm install -g json-morph
```

## 🛠️ Usage

```bash
json-morph input.json [options]
```

### Options

| Flag	| Description |
| --- | --- |
| --map	| Remap keys: "from.path:to.path" |
| --filter	| Filter expression: "age > 18 && active == true" |
| --add	| Add static fields: "key:value" |
| --remove	| Remove fields: "password,token" |
| --preserve	| Preserve all original fields (used with --map) |
| --output, -o	| Output to a file |
| --pretty	| Pretty-print output |
| --help	| Show help |
| --version	| Show version |

### 🔍 Examples

## 🧼 Filter and Clean

```bash
npx json-morph users.json \
  --filter "age > 21 && active == true" \
  --remove "password,internalNote" \
  --output active-users.json
```


## 🔄 Remap Keys

```bash
npx json-morph input.json \
  --map "user.name:fullName" \
  --map "user.id:userId" \
  --preserve
```

## ➕ Add Fields

```bash
npx json-morph input.json \
  --add "status:active" \
  --add "score:100"
```

## 🧪 Combine It All

```bash
npx  json-morph data.json \
  --filter "score >= 80" \
  --map "user.email:contact.email" \
  --add "passed:true" \
  --remove "debugLog" \
  --pretty
```

## 🧬 Programmatic Usage

You can also use json-morph as a library:

```javascript
import { transformJson } from 'json-morph';

const data = [{ name: 'Alice', age: 25 }];
const flags = {
  filter: ['age > 18'],
  map: ['name:fullName'],
  add: ['status:active'],
};

const output = transformJson(data, flags);
console.log(output);
```

## ⚡ Why Use json-morph?

* ✅ Lightweight, dependency-free
* ✅ Safer and easier than writing ad hoc scripts
* ✅ Works with deeply nested JSON
* ✅ Expressive filter logic without learning jq
* ✅ Scriptable, composable, and fun ✨


## 👤 About the Author
Built by [cinfinit](https://github.com/cinfinit), a part-time JSON whisperer, full-time logic artisan, and lifelong member of the "why-is-this-API-like-this" club.
Loves:
* Clean abstractions
* Messy data
* Terminal one-liners that look like sorcery
When not mutating JSON structures, probably found arguing with a linter, renaming variables obsessively, or building another side project that absolutely no one asked for — but everyone secretly needed.
“If it involves curly braces and chaos, I’m probably interested.”

