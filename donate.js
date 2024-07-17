document.addEventListener('DOMContentLoaded', () => {
    const donationForm = document.getElementById('donation-form');
    const addressInput = document.getElementById('address');
    const addressSuggestions = document.getElementById('address-suggestions');
    const scanBarcodeBtn = document.getElementById('scan-barcode-btn');
    const scannerContainer = document.getElementById('scanner-container');
    const interactive = document.getElementById('interactive');
    const closeScannerBtn = document.getElementById('close-scanner-btn');
    const barcodeInput = document.getElementById('barcode');

    scanBarcodeBtn.addEventListener('click', () => {
        scannerContainer.style.display = 'block';
        startScanner();
    });

    closeScannerBtn.addEventListener('click', () => {
        stopScanner();
        scannerContainer.style.display = 'none';
    });

    function startScanner() {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: interactive, 
                constraints: {
                    facingMode: "environment" 
                }
            },
            decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"]
            }
        }, function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        });

        Quagga.onDetected(function(result) {
            const code = result.codeResult.code;
            barcodeInput.value = code;
            stopScanner();
            scannerContainer.style.display = 'none';
        });
    }

    function stopScanner() {
        Quagga.stop();
    }

    donationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const address = addressInput.value;
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.length > 0) {
            const latitude = geocodeData[0].lat;
            const longitude = geocodeData[0].lon;

            document.getElementById('latitude').value = latitude;
            document.getElementById('longitude').value = longitude;

            const formData = new FormData(donationForm);

       
            const response = await fetch('donate.php', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Lebensmittel wurde verschenkt!');
                donationForm.reset();
                window.location.href = 'index.html'; 
            } else {
                alert('Fehler beim Verschenken der Lebensmittel.');
            }
        } else {
            alert('Konnte die Koordinaten für die angegebene Adresse nicht finden.');
        }
    });


    addressInput.addEventListener('input', async () => {
        const query = addressInput.value;
        if (query.length < 3) {
            addressSuggestions.innerHTML = '';
            return;
        }

        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        addressSuggestions.innerHTML = '';
        geocodeData.forEach(feature => {
            const addressParts = feature.display_name.split(', ');
            const relevantParts = addressParts.slice(0, 3).join(', ');
            const suggestion = document.createElement('div');
            suggestion.textContent = relevantParts;
            suggestion.addEventListener('click', () => {
                addressInput.value = relevantParts;
                addressSuggestions.innerHTML = '';
            });
            addressSuggestions.appendChild(suggestion);
        });
    });
});
