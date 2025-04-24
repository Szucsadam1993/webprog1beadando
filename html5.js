// Web Storage (localStorage) műveletek
function saveStorage() {
    const input = document.getElementById('storageInput').value;
    if (input) {
        let storageData = JSON.parse(localStorage.getItem('storageData')) || [];
        storageData.push({
            id: Date.now(),
            data: input,
            created_at: new Date().toISOString()
        });
        localStorage.setItem('storageData', JSON.stringify(storageData));
        alert("Adat sikeresen mentve!");
        loadStorageData();
        document.getElementById('storageInput').value = '';
    } else {
        alert('Kérlek, adj meg adatot!');
    }
}

function loadStorageData() {
    const storageData = JSON.parse(localStorage.getItem('storageData')) || [];
    const output = document.getElementById('storageOutput');
    output.innerHTML = '';
    if (storageData.length > 0) {
        const ul = document.createElement('ul');
        storageData.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.data} (Mentve: ${item.created_at})`;
            const editButton = document.createElement('button');
            editButton.textContent = 'Módosít';
            editButton.onclick = () => editStorage(item.id, item.data);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Töröl';
            deleteButton.onclick = () => deleteStorage(item.id);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            ul.appendChild(li);
        });
        output.appendChild(ul);
    } else {
        output.textContent = 'Nincs mentett adat.';
    }
}

function editStorage(id, currentData) {
    const newData = prompt('Új adat:', currentData);
    if (newData !== null && newData.trim() !== '') {
        let storageData = JSON.parse(localStorage.getItem('storageData')) || [];
        const index = storageData.findIndex(item => item.id === id);
        if (index !== -1) {
            storageData[index].data = newData;
            storageData[index].created_at = new Date().toISOString();
            localStorage.setItem('storageData', JSON.stringify(storageData));
            alert("Adat sikeresen módosítva!");
            loadStorageData();
        }
    }
}

function deleteStorage(id) {
    if (confirm('Biztosan törölni szeretnéd ezt az adatot?')) {
        let storageData = JSON.parse(localStorage.getItem('storageData')) || [];
        storageData = storageData.filter(item => item.id !== id);
        localStorage.setItem('storageData', JSON.stringify(storageData));
        alert("Adat sikeresen törölve!");
        loadStorageData();
    }
}

document.addEventListener('DOMContentLoaded', loadStorageData);

// Web Workers
function startWorker() {
    try {
        console.log('Starting Web Worker...');
        const worker = new Worker('worker.js');
        worker.onmessage = function(e) {
            console.log('Main thread received result:', e.data);
            document.getElementById('workerOutput').textContent = `Eredmény: ${e.data}`;
        };
        worker.onerror = function(error) {
            console.error('Worker error:', error);
            document.getElementById('workerOutput').textContent = `Hiba a Web Worker futtatása során: ${error.message}`;
        };
        worker.postMessage(1000000);
        console.log('Message sent to worker');
    } catch (error) {
        console.error('Worker initialization error:', error);
        document.getElementById('workerOutput').textContent = `Hiba a Web Worker indításakor: ${error.message}`;
    }
}

// Server-Sent Events (SSE)
function startSSE() {
    if (typeof(EventSource) !== "undefined") {
        const source = new EventSource('server.php');
        
        source.onmessage = function(event) {
            document.getElementById('sseOutput').textContent = event.data;
        };
        
        source.onerror = function() {
            document.getElementById('sseOutput').textContent = 'Hiba történt az SSE kapcsolat során.';
            source.close();
        };
    } else {
        document.getElementById('sseOutput').textContent = 'A böngésző nem támogatja a Server-Sent Events-t.';
    }
}

// SSE indítása az oldal betöltésekor
document.addEventListener('DOMContentLoaded', startSSE);

// Geolocation API
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('geoOutput').textContent = 
                    `Szélesség: ${position.coords.latitude}, Hosszúság: ${position.coords.longitude}`;
            },
            (error) => {
                document.getElementById('geoOutput').textContent = `Hiba: ${error.message}`;
            }
        );
    } else {
        document.getElementById('geoOutput').textContent = 'A geolocation nem támogatott.';
    }
}

// Drag and Drop
const dragItem = document.getElementById('dragItem');
const dropZone = document.getElementById('dropZone');

dragItem.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text', e.target.id);
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    dropZone.appendChild(document.getElementById(id));
});

// Canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let x = 10;
const speed = 2;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, 10, 50, 50);

    x += speed;
    if (x > canvas.width - 50) x = 10;

    requestAnimationFrame(animate);
}

animate();