document.addEventListener('DOMContentLoaded', async () => {
    try {
        const SHEET_ID = 'INSE1z4JBFhBxO7b3TZmo7FouuuXniY0RTU1D4sqyuoxjo1M';
        const API_KEY = '240847427795-ii8d8g4ceh29opb0fe7amh4lj6jg2hdd.apps.googleusercontent.com';
        const RANGE = 'Veicoli!A:Z';
        
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
        const data = await response.json();
        
        if(!data.values) throw new Error('Nessun dato trovato');
        
        const [headers, ...rows] = data.values;
        const vehicles = rows.map(row => {
            return headers.reduce((obj, key, index) => {
                obj[key] = row[index] || '';
                return obj;
            }, {});
        });

        renderVehicles(vehicles);
    } catch (error) {
        console.error('Errore nel caricamento dei veicoli:', error);
        document.getElementById('vehicle-grid').innerHTML = `
            <div class="pure-u-1">
                <p style="text-align:center; color:var(--grigio-chiaro);">
                    Impossibile caricare i veicoli al momento. Riprova più tardi.
                </p>
            </div>
        `;
    }
});

function renderVehicles(vehicles) {
    const grid = document.getElementById('vehicle-grid');
    
    grid.innerHTML = vehicles.map(vehicle => `
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-3">
            <div class="vehicle-card">
                <img src="${vehicle.LINK_FOTO}" 
                     alt="${vehicle.Marca} ${vehicle.Modello}" 
                     class="vehicle-image"
                     onerror="this.src='img/placeholder.jpg'">
                <div class="vehicle-content">
                    <h3 class="vehicle-title">${vehicle.Marca} ${vehicle.Modello}</h3>
                    <div class="vehicle-details">
                        <p>Anno: ${vehicle.Anno}</p>
                        <p>Km: ${vehicle.Chilometraggio}</p>
                        <p>${vehicle.Alimentazione} • ${vehicle.Cilindrata_CV} CV</p>
                        <p>Cambio: ${vehicle.Cambio}</p>
                    </div>
                    <div class="vehicle-price">
                        <div>Valore: ${formatPrice(vehicle.Valore_di_Mercato)}</div>
                        <div class="auction-price">Base d'asta: ${formatPrice(vehicle.Base_Asta)}</div>
                    </div>
                    <button class="pure-button cta-vehicle" 
                            onclick="scrollToForm('${vehicle.Id_Asta}')">
                        Partecipa all'asta (Scadenza: ${formatDate(vehicle.Scadenza_Asta)})
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function formatPrice(price) {
    return new Intl.NumberFormat('it-IT', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0
    }).format(price);
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
}

function scrollToForm(astaId) {
    document.getElementById('contatti').scrollIntoView({
        behavior: 'smooth'
    });
    // Aggiungi qui logica per associare l'asta al form
}