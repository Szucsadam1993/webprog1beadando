// API végpont és code
const API_URL = 'http://gamf.nhely.hu/ajax2/';
const CODE = 'FYOVDTxyz123'; // A te Neptun kódod + kitalált kód

// Hibák és üzenetek kezelése
function showError(message) {
    console.error(message);
    const errorMessageDiv = document.getElementById('errorMessage');
    if (errorMessageDiv) {
        errorMessageDiv.textContent = message;
    }
}

function showMessage(elementId, message, color = 'green') {
    const messageDiv = document.getElementById(elementId);
    if (messageDiv) {
        messageDiv.style.color = color;
        messageDiv.textContent = message;
    }
}

// Segítő függvény a POST kéréshez
function sendRequest(params) {
    console.log('Kérés indítása:', params);
    const formData = new FormData();
    for (const key in params) {
        formData.append(key, params[key]);
    }

    return fetch(API_URL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Válasz státusz:', response.status);
        if (!response.ok) {
            throw new Error('Hiba történt a kérés során: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('API válasz:', data);
        return data;
    })
    .catch(error => {
        showError('Hiba: ' + error.message);
        throw error;
    });
}

// Validáció a Create és Update műveletekhez
function validateInput(name, height, weight) {
    const maxLength = 30;
    if (!name || !height || !weight) {
        showError('Minden mező kitöltése kötelező!');
        return false;
    }
    if (name.length > maxLength || height.length > maxLength || weight.length > maxLength) {
        showError('A mezők maximum 30 karaktert tartalmazhatnak!');
        return false;
    }
    return true;
}

// Read művelet
function readData() {
    console.log('readData() hívása');
    const readResult = document.getElementById('readResult');
    const statsResult = document.getElementById('statsResult');
    const errorMessage = document.getElementById('errorMessage');

    if (!readResult || !statsResult || !errorMessage) {
        console.error('Hiányzó DOM elemek: readResult, statsResult vagy errorMessage');
        return;
    }

    readResult.innerHTML = '';
    statsResult.innerHTML = '';
    errorMessage.textContent = '';

    sendRequest({ op: 'read', code: CODE })
        .then(data => {
            if (!data || typeof data.rowCount === 'undefined') {
                showError('Érvénytelen API válasz formátum.');
                return;
            }

            if (data.rowCount === 0) {
                readResult.innerHTML = 'Nincsenek rekordok a megadott kódhoz.';
                return;
            }

            // Adatok kiírása egymás alá
            let html = '<h4>Rekordok:</h4>';
            data.list.forEach(item => {
                html += `
                    ID: ${item.id}<br>
                    Név: ${item.name}<br>
                    Magasság: ${item.height}<br>
                    Súly: ${item.weight}<br>
                    Kód: ${item.code}<br>
                    ------------------<br>
                `;
            });
            readResult.innerHTML = html;

            // Height statisztikák
            const heights = data.list.map(item => parseFloat(item.height)).filter(h => !isNaN(h));
            if (heights.length > 0) {
                const sum = heights.reduce((a, b) => a + b, 0);
                const average = sum / heights.length;
                const max = Math.max(...heights);
                statsResult.innerHTML = `
                    <h4>Height statisztikák:</h4>
                    Összeg: ${sum}<br>
                    Átlag: ${average.toFixed(2)}<br>
                    Legnagyobb: ${max}<br>
                `;
            } else {
                statsResult.innerHTML = 'Nincsenek érvényes magasság adatok a statisztikákhoz.';
            }
        })
        .catch(error => {
            console.error('readData hiba:', error);
        });
}

// Create művelet
function createData() {
    console.log('createData() hívása');
    const name = document.getElementById('createName').value;
    const height = document.getElementById('createHeight').value;
    const weight = document.getElementById('createWeight').value;
    const createMessage = document.getElementById('createMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (!createMessage || !errorMessage) {
        console.error('Hiányzó DOM elemek: createMessage vagy errorMessage');
        return;
    }

    createMessage.textContent = '';
    errorMessage.textContent = '';

    if (!validateInput(name, height, weight)) return;

    sendRequest({ op: 'create', name, height, weight, code: CODE })
        .then(data => {
            showMessage('createMessage', `Létrehozás sikeres! Érintett sorok: ${data.affectedRows}`);
            if (data.affectedRows > 0) {
                document.getElementById('createName').value = '';
                document.getElementById('createHeight').value = '';
                document.getElementById('createWeight').value = '';
            }
        })
        .catch(error => {
            console.error('createData hiba:', error);
        });
}

// Adatok betöltése Update-hez
function getDataForId() {
    console.log('getDataForId() hívása');
    const id = document.getElementById('updateId').value.trim(); // Szóközök eltávolítása
    const updateForm = document.getElementById('updateForm');
    const errorMessage = document.getElementById('errorMessage');

    if (!id) {
        showError('Az ID mező nem lehet üres!');
        return;
    }

    if (!updateForm || !errorMessage) {
        console.error('Hiányzó DOM elemek: updateForm vagy errorMessage');
        return;
    }

    sendRequest({ op: 'read', code: CODE })
        .then(data => {
            console.log('API válasz a getDataForId-ban:', data);
            console.log('Keresett ID:', id);

            // Az ID-t stringként kezeljük, és a válaszban is stringként hasonlítjuk
            const record = data.list.find(item => String(item.id) === String(id));
            console.log('Talált rekord:', record);

            if (!record) {
                showError('Nincs rekord a megadott ID-vel és kóddal!');
                updateForm.style.display = 'none';
                return;
            }

            document.getElementById('updateName').value = record.name;
            document.getElementById('updateHeight').value = record.height;
            document.getElementById('updateWeight').value = record.weight;
            updateForm.style.display = 'block';
            errorMessage.textContent = '';
            showMessage('updateMessage', 'Adatok betöltve!', 'blue');
        })
        .catch(error => {
            console.error('getDataForId hiba:', error);
        });
}

// Update művelet
function updateData() {
    console.log('updateData() hívása');
    const id = document.getElementById('updateId').value.trim();
    const name = document.getElementById('updateName').value;
    const height = document.getElementById('updateHeight').value;
    const weight = document.getElementById('updateWeight').value;
    const updateMessage = document.getElementById('updateMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (!updateMessage || !errorMessage) {
        console.error('Hiányzó DOM elemek: updateMessage vagy errorMessage');
        return;
    }

    updateMessage.textContent = '';
    errorMessage.textContent = '';

    if (!id) {
        showError('Az ID mező nem lehet üres!');
        return;
    }

    if (!validateInput(name, height, weight)) return;

    sendRequest({ op: 'update', id, name, height, weight, code: CODE })
        .then(data => {
            showMessage('updateMessage', `Módosítás sikeres! Érintett sorok: ${data.affectedRows}`);
            if (data.affectedRows > 0) {
                document.getElementById('updateForm').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('updateData hiba:', error);
        });
}

// Delete művelet
function deleteData() {
    console.log('deleteData() hívása');
    const id = document.getElementById('deleteId').value.trim();
    const deleteMessage = document.getElementById('deleteMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (!deleteMessage || !errorMessage) {
        console.error('Hiányzó DOM elemek: deleteMessage vagy errorMessage');
        return;
    }

    deleteMessage.textContent = '';
    errorMessage.textContent = '';

    if (!id) {
        showError('Az ID mező nem lehet üres!');
        return;
    }

    sendRequest({ op: 'delete', id, code: CODE })
        .then(data => {
            showMessage('deleteMessage', `Törlés sikeres! Érintett sorok: ${data.affectedRows}`);
            if (data.affectedRows > 0) {
                document.getElementById('deleteId').value = '';
            }
        })
        .catch(error => {
            console.error('deleteData hiba:', error);
        });
}

// Teszt logolás az oldal betöltésekor
document.addEventListener('DOMContentLoaded', () => {
    console.log('Oldal betöltve, ajax.js fut.');
});