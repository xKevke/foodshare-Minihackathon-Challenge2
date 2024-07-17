document.addEventListener('DOMContentLoaded', () => {
    const currentLocationBtn = document.getElementById('current-location-btn');
    const loadingDiv = document.getElementById('loading');
    const mapDiv = document.getElementById('map');
    const donationsList = document.getElementById('donations-list');

    let map;  
    let markers = [];
    let currentLocationMarker;
    let cachedProductData = {}; 


    function initMap() {
        const latitude = 51.1657; 
        const longitude = 10.4515; 
        map = L.map(mapDiv).setView([latitude, longitude], 6); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        loadMarkers(); 
        loadRecentDonations(); 
    }


    async function loadMarkers() {
        const response = await fetch('get_markers.php');
        const data = await response.json();

        for (const donation of data) {
            await loadProductData(donation.barcode, donation);
        }
    }

    
    async function loadRecentDonations() {
        const response = await fetch('get_recent_donations.php');
        const data = await response.json();

        data.forEach(donation => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="#" class="product-link" data-barcode="${donation.barcode}"><strong>${donation.product_name}</strong></a> gespendet von ${donation.first_name} ${donation.last_name}`;
            listItem.querySelector('.product-link').addEventListener('click', (e) => {
                e.preventDefault();
                loadProductData(donation.barcode, donation, true);
            });
            donationsList.appendChild(listItem);
        });
    }

    
    initMap();

 
    currentLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                if (currentLocationMarker) {
                    map.removeLayer(currentLocationMarker);
                }

                currentLocationMarker = L.marker([latitude, longitude], { 
                    icon: L.icon({ 
                        iconUrl: 'img/haus.png', 
                        iconSize: [25, 25], 
                        iconAnchor: [12, 12] 
                    }) 
                }).addTo(map)
                    .bindPopup('Ihr aktueller Standort')
                    .openPopup();

                map.setView([latitude, longitude], 13);
            });
        } else {
            alert('Geolocation wird von diesem Browser nicht unterstützt.');
        }
    });

    async function loadProductData(barcode, donation, showPopup = false) {
        loadingDiv.style.display = 'block'; 

  
        if (cachedProductData[barcode]) {
            displayProductData(cachedProductData[barcode], donation, showPopup);
            loadingDiv.style.display = 'none'; 
        } else {
           
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json?lc=de`);
            const data = await response.json();

            loadingDiv.style.display = 'none'; 

            if (data.product) {
                cachedProductData[barcode] = data.product; 
                displayProductData(data.product, donation, showPopup);
            } else {
                alert('Produktinformationen konnten nicht abgerufen werden.');
            }
        }
    }

    function displayProductData(product, donation, showPopup) {
        const iconUrl = product.image_small_url || 'default_product_image.png';
        const weight = product.quantity || 'N/A';
        const calories = product.nutriments['energy-kcal_100g'] ? `${product.nutriments['energy-kcal_100g']} kcal` : 'N/A';
        const nutriScore = product.nutrition_grades ? product.nutrition_grades.toUpperCase() : 'N/A';
        const expiryDate = new Date(donation.expiry_date);
        const now = new Date();
        const timeDiff = Math.max(0, expiryDate - now);
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const mhd = donation.mhd ? new Date(donation.mhd).toLocaleDateString('de-DE') : 'N/A';

        const productIcon = L.divIcon({
            html: `<div class="custom-marker" style="background-image: url('${iconUrl}');"></div>`,
            className: '',
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50]
        });

        const marker = L.marker([donation.latitude, donation.longitude], { icon: productIcon }).addTo(map);

        const productInfo = `<div style="max-height: 300px; overflow-y: auto;">
                                <img src="${iconUrl}" alt="${product.product_name}" style="width: 50px; height: auto; margin-right: 10px;">
                                <div>
                                    <strong>${product.product_name}</strong><br>
                                    <strong>Gewicht / Liter:</strong> ${weight}<br>
                                    <strong>Kalorien:</strong> ${calories}<br>
                                    <strong>Nutri-Score:</strong> ${nutriScore}<br>
                                    <strong>Zutaten:</strong> ${product.ingredients_text_de || product.ingredients_text_en || 'Zutaten nicht auf Deutsch oder Englisch verfügbar.'}<br><br>
                                    <strong>Spenderinformationen:</strong><br>
                                    ${donation.first_name} ${donation.last_name}<br>
                                    ${donation.address}<br>
                                    ${donation.phone}<br>
                                    ${donation.email}<br><br>
                                    <strong>MHD:</strong> ${mhd}<br>
                                    <strong>Verfügbarkeit:</strong> Noch ${daysLeft} Tage verfügbar
                                </div>
                             </div>`;

        marker.bindPopup(productInfo);

        markers.push(marker);

        if (showPopup) {
            marker.openPopup();
        }
    }
});
