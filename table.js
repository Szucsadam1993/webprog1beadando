document.addEventListener('DOMContentLoaded', () => {
    const dataTableBody = document.getElementById('dataTableBody');
    const dataForm = document.getElementById('dataForm');

    if (!dataTableBody || !dataForm) {
        console.error('Hiba: Nem található egy vagy több szükséges DOM elem!');
        return;
    }

    let data = [
        { name: 'Lilla', age: 15, city: 'Budapest', occupation: 'Tanuló' },
        { name: 'Anna', age: 22, city: 'Debrecen', occupation: 'Egyetemi hallgató' },
        { name: 'Péter', age: 30, city: 'Szeged', occupation: 'Programozó' },
        { name: 'Eszter', age: 28, city: 'Pécs', occupation: 'Marketinges' },
    ];

    let editingIndex = null;

    function renderTable() {
        dataTableBody.innerHTML = '';
        data.forEach((item, index) => {
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

    dataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('nameInput').value.trim();
        const age = parseInt(document.getElementById('ageInput').value);
        const city = document.getElementById('cityInput').value.trim();
        const occupation = document.getElementById('occupationInput').value.trim();

        if (!dataForm.checkValidity()) {
            dataForm.reportValidity();
            return;
        }

        const newEntry = { name, age, city, occupation };

        if (editingIndex !== null) {
            data[editingIndex] = newEntry;
            editingIndex = null;
        } else {
            data.push(newEntry);
        }

        renderTable();
        dataForm.reset();
    });

    function editRow(index) {
        editingIndex = index;
        const item = data[index];
        document.getElementById('nameInput').value = item.name;
        document.getElementById('ageInput').value = item.age;
        document.getElementById('cityInput').value = item.city;
        document.getElementById('occupationInput').value = item.occupation;
    }

    function deleteRow(index) {
        if (confirm('Biztosan törölni szeretnéd ezt a sort?')) {
            data.splice(index, 1);
            editingIndex = null;
            dataForm.reset();
            renderTable();
        }
    }

    renderTable();
});