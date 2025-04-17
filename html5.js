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
            ul.appendChild(li);
        });
        output.appendChild(ul);
    } else {
        output.textContent = 'Nincs mentett adat.';
    }
}

document.addEventListener('DOMContentLoaded', loadStorageData);

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

document.addEventListener('DOMContentLoaded', startSSE);

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