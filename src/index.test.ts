import { GoogleSpreadsheetStorage } from "./index";

jest.setTimeout(1000 * 30);

const getStorage = () =>
  new GoogleSpreadsheetStorage(process.env.SHEET_ID!, {
    private_key: process.env.PRIVATE_KEY!,
    client_email: process.env.CLIENT_EMAIL!,
  });

test("set and get", async () => {
  const storage = getStorage();
  await storage.configure();

  const index = await storage.set("shark", "a!");
  await expect(storage.get("shark")).resolves.toBe("a!");
  await expect(storage.getByIndex(index)).resolves.toBe("a!");
  await expect(storage.delete("shark")).resolves.toBe(index);
  await expect(storage.getByIndex(index)).resolves.toBe(null);
});

test("get null", async () => {
  const storage = getStorage();
  await storage.configure();

  await expect(storage.getByIndex(100)).resolves.toBe(null);
});
