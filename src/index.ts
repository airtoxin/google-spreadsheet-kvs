import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, ServiceAccountCredentials } from "google-spreadsheet";
import { JsonValue } from "type-fest";
import { crc16 } from "crc";

const GOOGLE_SPREADSHEET_MAX_CELL_COUNT = 5000000;
const COLS = 1;
const ROWS = Math.floor((GOOGLE_SPREADSHEET_MAX_CELL_COUNT / COLS) - 1);

export class GoogleSpreadsheetStorage {
  private doc: GoogleSpreadsheet;
  private sheet: GoogleSpreadsheetWorksheet | undefined;
  constructor(
    public sheetId: string,
    private credentials: ServiceAccountCredentials
  ) {
    this.doc = new GoogleSpreadsheet(sheetId);
  }

  async configure(): Promise<void> {
    await this.doc.useServiceAccountAuth(this.credentials);
    await this.doc.loadInfo();
    this.sheet = this.doc.sheetsByIndex[0];
    if (this.sheet == null) {
      this.sheet = await this.doc.addSheet();
    }
    await this.sheet.updateProperties({ gridProperties: { rowCount: 1, columnCount: COLS } });
    await this.sheet.updateProperties({ gridProperties: { rowCount: ROWS, columnCount: COLS } });
  }

  async set(key: string, value: JsonValue): Promise<number> {
    const index = this.getIndex(key);
    return this.setByIndex(index, value);
  }

  async setByIndex(index: number, value: JsonValue): Promise<number> {
    if (this.sheet == null) throw new Error("GoogleSpreadsheetStore not configured.");
    await this.sheet.loadCells(`A${index}`)
    const cell = await this.sheet.getCellByA1(`A${index}`);
    cell.value = JSON.stringify(value);
    await this.sheet.saveUpdatedCells();
    return index;

  }

  async get(key: string): Promise<JsonValue> {
    const index = this.getIndex(key);
    return this.getByIndex(index);
  }

  async getByIndex(index: number): Promise<JsonValue> {
    if (this.sheet == null) throw new Error("GoogleSpreadsheetStore not configured.");
    await this.sheet.loadCells(`A${index}`)
    const cell = await this.sheet.getCellByA1(`A${index}`);
    if (typeof cell.value !== "string") return null;
    return JSON.parse(cell.value);
  }

  async delete(key: string): Promise<number> {
    const index = this.getIndex(key);
    return this.deleteByIndex(index);
  }

  async deleteByIndex(index: number): Promise<number> {
    if (this.sheet == null) throw new Error("GoogleSpreadsheetStore not configured.");
    await this.sheet.loadCells(`A${index}`)
    const cell = await this.sheet.getCellByA1(`A${index}`);
    cell.value = null!;
    await this.sheet.saveUpdatedCells();
    return index;
  }

  private getIndex(key: string): number {
    return crc16(key);
  }
}
