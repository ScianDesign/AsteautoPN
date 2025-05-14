document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        nome: document.getElementById('nome').value,
        cognome: document.getElementById('cognome').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value
    };

    try {
        const response = await fetch('https://hook.eu2.make.com/nwo3nicanp1np9aetymy8ri9ha6ewfpb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(formData)
        });

        if(response.ok) {
            alert('Richiesta inviata! Ti contatteremo entro 24 ore.');
            document.getElementById('contactForm').reset();
        } else {
            const errorData = await response.json();
            console.error('Errore dal server:', errorData);
            alert(`Errore ${response.status}: Riprova più tardi`);
        }
    } catch (error) {
        console.error('Errore di rete:', error);
        alert('Connessione fallita. Verifica la tua rete.');
    }
});