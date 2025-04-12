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