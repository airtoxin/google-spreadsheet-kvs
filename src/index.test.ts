import { GoogleSpreadsheetStorage } from "./index";

jest.setTimeout(1000 * 30);

const getStorage = () =>
  new GoogleSpreadsheetStorage(process.env.SHEET_ID!, {
    private_key: process.env.PRIVATE_KEY!,
    client_email: process.env.CLIENT_EMAIL!,
  });

test("set and get string", async () => {
  const storage = getStorage();
  await storage.configure();

  const index = await storage.set("shark", "a!");
  await expect(storage.get("shark")).resolves.toBe("a!");
  await expect(storage.getByIndex(index)).resolves.toBe("a!");
  await expect(storage.delete("shark")).resolves.toBe(index);
  await expect(storage.getByIndex(index)).resolves.toBe(null);
});

test("set and get number", async () => {
  const storage = getStorage();
  await storage.configure();

  const index = await storage.set("number", 123456);
  await expect(storage.get("number")).resolves.toBe(123456);
  await expect(storage.getByIndex(index)).resolves.toBe(123456);
  await expect(storage.delete("number")).resolves.toBe(index);
  await expect(storage.getByIndex(index)).resolves.toBe(null);
});

test("set and get boolean", async () => {
  const storage = getStorage();
  await storage.configure();

  const index = await storage.set("bool", true);
  await expect(storage.get("bool")).resolves.toBe(true);
  await expect(storage.getByIndex(index)).resolves.toBe(true);
  await expect(storage.delete("bool")).resolves.toBe(index);
  await expect(storage.getByIndex(index)).resolves.toBe(null);
});

test("set and get array", async () => {
  const storage = getStorage();
  await storage.configure();

  const index = await storage.set("array", [1, true, "hello", []]);
  await expect(storage.get("array")).resolves.toEqual([1, true, "hello", []]);
  await expect(storage.getByIndex(index)).resolves.toEqual([1, true, "hello", []]);
  await expect(storage.delete("array")).resolves.toBe(index);
  await expect(storage.getByIndex(index)).resolves.toBe(null);
});

test("set and get object", async () => {
  const storage = getStorage();
  await storage.configure();

  const index = await storage.set("object", { k: 1, a: [1,2, {}] });
  await expect(storage.get("object")).resolves.toEqual({ k: 1, a: [1,2, {}] });
  await expect(storage.getByIndex(index)).resolves.toEqual({ k: 1, a: [1,2, {}] });
  await expect(storage.delete("object")).resolves.toBe(index);
  await expect(storage.getByIndex(index)).resolves.toBe(null);
});

test("get null", async () => {
  const storage = getStorage();
  await storage.configure();

  await expect(storage.getByIndex(100)).resolves.toBe(null);
});

test("usage example", async () => {
  const storage = getStorage();
  await storage.configure();

  await storage.set("My key", "Example value");
  await expect(storage.get("My key")).resolves.toBe("Example value");

  await storage.delete("My key");
  await expect(storage.get("My key")).resolves.toBe(null);
});
