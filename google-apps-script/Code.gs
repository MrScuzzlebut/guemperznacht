/**
 * Google Apps Script für Gümper Znacht Anmeldungen
 * 
 * Optimiertes Script mit:
 * - CORS-Unterstützung
 * - Fehlerbehandlung
 * - Datenvalidierung
 * - Automatische Header-Erstellung
 * 
 * SETUP-ANLEITUNG:
 * 1. Google Sheets öffnen und neue Tabelle erstellen
 * 2. Erweiterungen > Apps Script
 * 3. Diesen Code einfügen
 * 4. Speichern (Strg+S)
 * 5. Deploy > New deployment
 * 6. Typ: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Deploy klicken
 * 10. Web App URL kopieren und in .env.local als GOOGLE_APPS_SCRIPT_URL eintragen
 */

/**
 * Hauptfunktion für POST-Requests
 * Verarbeitet Anmeldungsdaten und speichert sie in Google Sheets
 */
function doPost(e) {
  try {
    // CORS-Header setzen
    const output = ContentService.createTextOutput();
    
    // Parse JSON-Daten
    let data;
    try {
      const postData = e.postData ? e.postData.contents : '{}';
      data = JSON.parse(postData);
    } catch (parseError) {
      return output
        .setContent(JSON.stringify({
          success: false,
          error: 'Ungültiges JSON-Format',
          details: parseError.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validierung: Prüfe ob 'rows' vorhanden ist
    if (!data.rows || !Array.isArray(data.rows)) {
      return output
        .setContent(JSON.stringify({
          success: false,
          error: 'Keine Daten (rows) gefunden',
          received: Object.keys(data)
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Prüfe ob Zeilen vorhanden sind
    if (data.rows.length === 0) {
      return output
        .setContent(JSON.stringify({
          success: false,
          error: 'Keine Zeilen zum Speichern'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Hole die aktive Tabelle
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Erstelle Header falls nicht vorhanden
    ensureHeaders(sheet);
    
    // Validiere und speichere jede Zeile
    const results = [];
    const errors = [];
    
    for (let i = 0; i < data.rows.length; i++) {
      const row = data.rows[i];
      
      // Validierung der Zeile
      const validation = validateRow(row, i);
      if (!validation.valid) {
        errors.push({
          rowIndex: i,
          error: validation.error,
          data: row
        });
        continue;
      }
      
      // Formatiere die Zeile für Google Sheets
      const formattedRow = formatRow(row);
      
      // Füge Zeile hinzu
      try {
        sheet.appendRow(formattedRow);
        results.push({
          rowIndex: i,
          success: true
        });
      } catch (appendError) {
        errors.push({
          rowIndex: i,
          error: 'Fehler beim Hinzufügen der Zeile: ' + appendError.toString(),
          data: row
        });
      }
    }
    
    // Bereite Antwort vor
    const response = {
      success: errors.length === 0,
      saved: results.length,
      errors: errors.length,
      results: results,
      errorDetails: errors.length > 0 ? errors : undefined
    };
    
    // Log für Debugging (nur bei Fehlern)
    if (errors.length > 0) {
      console.error('Fehler beim Speichern:', JSON.stringify(errors));
    } else {
      console.log('Erfolgreich gespeichert:', results.length + ' Zeilen');
    }
    
    return output
      .setContent(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Allgemeine Fehlerbehandlung
    console.error('Kritischer Fehler:', error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Server-Fehler',
        details: error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET-Request Handler (für Tests)
 */
function doGet(e) {
  const output = ContentService.createTextOutput();
  return output
    .setContent(JSON.stringify({
      status: 'ok',
      message: 'Google Apps Script ist aktiv',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Stellt sicher, dass die Header-Zeile existiert
 */
function ensureHeaders(sheet) {
  // Prüfe ob bereits Header vorhanden sind
  if (sheet.getLastRow() > 0) {
    // Prüfe ob erste Zeile Header enthält
    const firstRow = sheet.getRange(1, 1, 1, 10).getValues()[0];
    const hasHeaders = firstRow[0] === 'Zeitstempel' || firstRow[0] === 'Timestamp';
    
    if (hasHeaders) {
      return; // Header bereits vorhanden
    }
  }
  
  // Erstelle Header
  const headers = [
    'Zeitstempel',
    'Payment Intent ID',
    'Vorname',
    'Name',
    'Telefon',
    'Email',
    'Option',
    'Allergien',
    'Betrag (CHF)',
    'Status'
  ];
  
  sheet.insertRowBefore(1);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatiere Header-Zeile
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  
  // Setze Spaltenbreiten
  sheet.setColumnWidth(1, 180); // Zeitstempel
  sheet.setColumnWidth(2, 200); // Payment Intent ID
  sheet.setColumnWidth(3, 120); // Vorname
  sheet.setColumnWidth(4, 120); // Name
  sheet.setColumnWidth(5, 130); // Telefon
  sheet.setColumnWidth(6, 200); // Email
  sheet.setColumnWidth(7, 100); // Option
  sheet.setColumnWidth(8, 200); // Allergien
  sheet.setColumnWidth(9, 100); // Betrag
  sheet.setColumnWidth(10, 100); // Status
}

/**
 * Validiert eine Datenzeile
 */
function validateRow(row, index) {
  // Prüfe ob row ein Array ist
  if (!Array.isArray(row)) {
    return {
      valid: false,
      error: 'Zeile ' + index + ': Kein Array'
    };
  }
  
  // Prüfe minimale Anzahl von Spalten (mindestens 10)
  if (row.length < 10) {
    return {
      valid: false,
      error: 'Zeile ' + index + ': Zu wenige Spalten (erwartet: 10, erhalten: ' + row.length + ')'
    };
  }
  
  // Prüfe Pflichtfelder
  if (!row[2] || row[2].toString().trim() === '') {
    return {
      valid: false,
      error: 'Zeile ' + index + ': Vorname fehlt'
    };
  }
  
  if (!row[3] || row[3].toString().trim() === '') {
    return {
      valid: false,
      error: 'Zeile ' + index + ': Name fehlt'
    };
  }
  
  if (!row[4] || row[4].toString().trim() === '') {
    return {
      valid: false,
      error: 'Zeile ' + index + ': Telefon fehlt'
    };
  }
  
  if (!row[6] || row[6].toString().trim() === '') {
    return {
      valid: false,
      error: 'Zeile ' + index + ': Option fehlt'
    };
  }
  
  return { valid: true };
}

/**
 * Formatiert eine Zeile für Google Sheets
 */
function formatRow(row) {
  return [
    row[0] || new Date().toISOString(), // Zeitstempel
    row[1] || '', // Payment Intent ID
    String(row[2] || '').trim(), // Vorname
    String(row[3] || '').trim(), // Name
    String(row[4] || '').trim(), // Telefon
    String(row[5] || '').trim(), // Email
    String(row[6] || '').trim(), // Option
    String(row[7] || '').trim(), // Allergien
    row[8] || 0, // Betrag
    String(row[9] || 'Bezahlt').trim() // Status
  ];
}

/**
 * Test-Funktion (kann manuell ausgeführt werden)
 */
function testScript() {
  const testData = {
    rows: [
      [
        new Date().toISOString(),
        'test_payment_123',
        'Max',
        'Mustermann',
        '+41 79 123 45 67',
        'max@example.com',
        'Fleisch',
        'Keine',
        130,
        'Bezahlt'
      ]
    ]
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test-Ergebnis:', result.getContent());
}
