/**
 * GOOGLE APPS SCRIPT - PENERIMA LEMBAR JAWABAN
 * Buat Google Sheet, buka Extensions > Apps Script, lalu tempel kode ini.
 * Ganti SPREADSHEET_ID dengan ID Google Sheet milik Anda.
 */
const SPREADSHEET_ID = "GANTI_DENGAN_ID_GOOGLE_SHEET";
const SHEET_NAME = "Hasil_Jawaban";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const raw = e && e.parameter && e.parameter.payload;
    if (!raw) throw new Error("Payload tidak ditemukan.");
    const data = JSON.parse(raw);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    const headers = [
      "Waktu", "Nama", "Kelas",
      "Nomor 1", "Nomor 2", "Nomor 3", "Nomor 4", "Nomor 5",
      "Nomor 6", "Nomor 7", "Nomor 8", "Nomor 9", "Nomor 10",
      "Jumlah Pelanggaran", "Catatan Pelanggaran", "Status Pengumpulan"
    ];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
    }

    const a = data.answers || {};
    const row = [
      data.waktu || new Date().toISOString(),
      data.nama || "",
      data.kelas || "",
      a.q1 || "", a.q2 || "", a.q3 || "", a.q4 || "", a.q5 || "",
      a.q6 || "", a.q7 || "", a.q8 || "", a.q9 || "", a.q10 || "",
      Number(data.jumlahPelanggaran || 0),
      JSON.stringify(data.catatanPelanggaran || []),
      data.statusPengumpulan || "Dikirim siswa"
    ];
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ok:true, message:"Jawaban tersimpan"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ok:false, error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
