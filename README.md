# google-spreadsheet-kvs

## Install

```shell script
yarn add google-spreadsheet-kvs
```

## Usage

```typescript
import { GoogleSpreadsheetStorage } from "google-spreadsheet-kvs";
import credentials from "./path/to/google/serviceAccount/credentials.json";

const storage = new GoogleSpreadsheetStorage("SHEET_ID", credentials);
await storage.configure();

await storage.set("My key", "Example value");
console.log(await storage.get("My key")); // "Example value"

await storage.delete("My key");
console.log(await storage.get("My key")); // null
```

## Limitations

This library uses CRC16 hashing algorithm to convert Key to sheet row index.    
This means different key maps to same row index, so accidentally override value with different key.
