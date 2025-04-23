let chartData = JSON.parse(localStorage.getItem('chartData')) || [
    { label: 'Január', value: 100 },
    { label: 'Február', value: 150 },
    { label: 'Március', value: 200 }
];

let chartType = 'bar';
let myChart;

function initChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: chartData.map(data => data.label),
            datasets: [{
                label: 'Adatok',
                data: chartData.map(data => data.value),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function loadTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    chartData.forEach((data, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${data.label}</td>
            <td>${data.value}</td>
            <td>
                <button onclick="editData(${index})">Szerkeszt</button>
                <button onclick="deleteData(${index})">Töröl</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function updateChart() {
    myChart.data.labels = chartData.map(data => data.label);
    myChart.data.datasets[0].data = chartData.map(data => data.value);
    myChart.update();
    loadTable();
}

function addData() {
    const label = document.getElementById('labelInput').value;
    const value = parseInt(document.getElementById('valueInput').value);
    if (label && !isNaN(value)) {
        chartData.push({ label, value });
        localStorage.setItem('chartData', JSON.stringify(chartData));
        updateChart();
        document.getElementById('labelInput').value = '';
        document.getElementById('valueInput').value = '';
    } else {
        alert('Kérlek, adj meg érvényes címkét és értéket!');
    }
}

function editData(index) {
    const newLabel = prompt('Új címke:', chartData[index].label);
    const newValue = prompt('Új érték:', chartData[index].value);
    if (newLabel && !isNaN(parseInt(newValue))) {
        chartData[index] = { label: newLabel, value: parseInt(newValue) };
        localStorage.setItem('chartData', JSON.stringify(chartData));
        updateChart();
    }
}

function deleteData(index) {
    if (confirm('Biztosan törölni szeretnéd ezt az adatot?')) {
        chartData.splice(index, 1);
        localStorage.setItem('chartData', JSON.stringify(chartData));
        updateChart();
    }
}

function setChartType(type) {
    chartType = type;
    myChart.destroy();
    initChart();
}

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    loadTable();
});