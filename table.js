document.addEventListener('DOMContentLoaded', () => {
    // DOM elemek lekérdezése
    const dataTableBody = document.getElementById('dataTableBody');
    const dataForm = document.getElementById('dataForm');
    const filterName = document.getElementById('filterName');
    const filterAge = document.getElementById('filterAge');
    const filterCity = document.getElementById('filterCity');
    const filterOccupation = document.getElementById('filterOccupation');

    // Ellenőrizzük, hogy minden szükséges elem létezik-e
    if (!dataTableBody || !dataForm || !filterName || !filterAge || !filterCity || !filterOccupation) {
        console.error('Hiba: Nem található egy vagy több szükséges DOM elem!');
        return;
    }

    // Adatok betöltése a localStorage-ből, vagy alapértelmezett adatok használata
    let data = JSON.parse(localStorage.getItem('tableData')) || [
        { name: 'Lilla', age: 15, city: 'Budapest', occupation: 'Tanuló' },
        { name: 'Anna', age: 22, city: 'Debrecen', occupation: 'Egyetemi hallgató' },
        { name: 'Péter', age: 30, city: 'Szeged', occupation: 'Programozó' },
        { name: 'Eszter', age: 28, city: 'Pécs', occupation: 'Marketinges' },
    ];

    let editingIndex = null;

    // Táblázat renderelése
    function renderTable(filteredData = data) {
        dataTableBody.innerHTML = '';
        filteredData.forEach((item, index) => {
            const row = dataTableBody.insertRow();
            row.insertCell(0).textContent = item.name;
            row.insertCell(1).textContent = item.age;
            row.insertCell(2).textContent = item.city;
            row.insertCell(3).textContent = item.occupation;
            const actionsCell = row.insertCell(4);
            const editButton = document.createElement('button');
            editButton.textContent = 'Szerkeszt';
            editButton.className = 'edit-btn';
            editButton.addEventListener('click', () => editRow(index));
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Töröl';
            deleteButton.className = 'delete-btn';
            deleteButton.addEventListener('click', () => deleteRow(index));
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    }

    // Új sor hozzáadása vagy szerkesztés
    dataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('nameInput').value.trim();
        const age = parseInt(document.getElementById('ageInput').value);
        const city = document.getElementById('cityInput').value.trim();
        const occupation = document.getElementById('occupationInput').value.trim();

        // Validáció ellenőrzése
        if (!dataForm.checkValidity()) {
            dataForm.reportValidity();
            return;
        }

        const newEntry = { name, age, city, occupation };

        if (editingIndex !== null) {
            // Szerkesztés
            data[editingIndex] = newEntry;
            editingIndex = null;
        } else {
            // Új sor hozzáadása
            data.push(newEntry);
        }

        // Mentés a localStorage-be
        localStorage.setItem('tableData', JSON.stringify(data));
        renderTable();
        dataForm.reset();
    });

    // Sor szerkesztése
    function editRow(index) {
        editingIndex = index;
        const item = data[index];
        document.getElementById('nameInput').value = item.name;
        document.getElementById('ageInput').value = item.age;
        document.getElementById('cityInput').value = item.city;
        document.getElementById('occupationInput').value = item.occupation;
    }

    // Sor törlése
    function deleteRow(index) {
        if (confirm('Biztosan törölni szeretnéd ezt a sort?')) {
            data.splice(index, 1);
            editingIndex = null;
            dataForm.reset();
            localStorage.setItem('tableData', JSON.stringify(data));
            renderTable();
        }
    }

    // Rendezés
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            const isAscending = !header.classList.contains('asc');
            data.sort((a, b) => {
                const valueA = a[column];
                const valueB = b[column];
                if (typeof valueA === 'number') {
                    return isAscending ? valueA - valueB : valueB - valueA;
                }
                return isAscending
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            });
            document.querySelectorAll('.sortable').forEach(h => h.classList.remove('asc', 'desc'));
            header.classList.add(isAscending ? 'asc' : 'desc');
            renderTable();
        });
    });

    // Szűrés
    function applyFilters() {
        const nameFilter = filterName.value.toLowerCase();
        const ageFilter = filterAge.value;
        const cityFilter = filterCity.value.toLowerCase();
        const occupationFilter = filterOccupation.value.toLowerCase();

        const filteredData = data.filter(item => {
            return (
                (nameFilter === '' || item.name.toLowerCase().includes(nameFilter)) &&
                (ageFilter === '' || item.age.toString() === ageFilter) &&
                (cityFilter === '' || item.city.toLowerCase().includes(cityFilter)) &&
                (occupationFilter === '' || item.occupation.toLowerCase().includes(occupationFilter))
            );
        });

        renderTable(filteredData);
    }

    filterName.addEventListener('input', applyFilters);
    filterAge.addEventListener('input', applyFilters);
    filterCity.addEventListener('input', applyFilters);
    filterOccupation.addEventListener('input', applyFilters);

    // Kezdeti renderelés
    renderTable();
});