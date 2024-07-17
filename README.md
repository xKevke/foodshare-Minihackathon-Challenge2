# Foodshare

Mini Hackathon Challange 2
## Funktionen

- **Lebensmittel verschenken:** Benutzer können Lebensmittel registrieren und spenden.
- **Lebensmittel suchen:** Benutzer können nach Spenden in ihrer Nähe suchen.
- **Produktinformationen anzeigen:** Zeigt Gewicht, Kalorien, Nutri-Score und MHD (Mindesthaltbarkeitsdatum) der Produkte an.
- **Automatische Löschung:** Spenden werden nach 7 Tagen automatisch gelöscht.
- **E-Mail-Benachrichtigungen:** Benutzer erhalten Bestätigungs-E-Mails mit einem Löschlink.

## Technologien

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** PHP
- **Datenbank:** MySQL
- **APIs:** 
  - Open Food Facts API
  - Nominatim API
- **Kartenanzeige:** Leaflet.js

## Installation

Folgen Sie diesen Schritten, um das Projekt lokal zu installieren und auszuführen:

1. **Repository herunterladen:**
    Laden Sie das Projekt als ZIP-Datei herunter und entpacken Sie es.

2. **Datenbank einrichten:**
    - Erstellen Sie eine MySQL-Datenbank und führen Sie die folgenden SQL-Befehle aus, um die erforderlichen Tabellen zu erstellen:

    ```sql
    CREATE DATABASE foodshare;
    USE foodshare;

    CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        barcode VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        UNIQUE KEY (barcode)
    );

    CREATE TABLE donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        barcode VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        latitude DOUBLE NOT NULL,
        longitude DOUBLE NOT NULL,
        delete_id VARCHAR(255) NOT NULL,
        expiry_date DATETIME NOT NULL,
        mhd DATE NOT NULL,
        FOREIGN KEY (barcode) REFERENCES products(barcode)
    );
    ```

3. **Datenbank:**
  
    <?php
    $servername = "YOUR_SERVERNAME";
    $username = "YOUR_USERNAME";
    $password = "YOUR_PASSWORD";
    $dbname = "YOUR_DBNAME";
    ?>
    ```


## Nutzung

### Lebensmittel verschenken

1. Klicken Sie auf "Lebensmittel verschenken".
2. Füllen Sie das Formular aus und scannen Sie den Barcode Ihres Produkts, um die Produktinformationen automatisch abzurufen.
3. Geben Sie die restlichen erforderlichen Informationen ein und klicken Sie auf "Verschenken".
4. Sie erhalten eine Bestätigungs-E-Mail mit einem Löschlink, falls Sie das Produkt später entfernen möchten.

### Lebensmittel suchen

1. Auf der Startseite können Sie die letzten Spenden in Ihrer Nähe anzeigen lassen.
2. Klicken Sie auf "Aktuellen Standort anzeigen", um Ihre aktuelle Position und die umliegenden Spenden auf der Karte zu sehen.
3. Klicken Sie auf ein Produkt in der Liste, um weitere Details anzuzeigen.
