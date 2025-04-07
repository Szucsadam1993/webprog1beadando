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

    function renderTable() {
        dataTableBody.innerHTML = '';
        data.forEach(item => {
            const row = dataTableBody.insertRow();
            row.insertCell(0).textContent = item.name;
            row.insertCell(1).textContent = item.age;
            row.insertCell(2).textContent = item.city;
            row.insertCell(3).textContent = item.occupation;
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

        data.push({ name, age, city, occupation });
        renderTable();
        dataForm.reset();
    });

    renderTable();
});