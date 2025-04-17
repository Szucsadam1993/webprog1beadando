let chartData = [
    { label: 'Január', value: 100 },
    { label: 'Február', value: 150 },
    { label: 'Március', value: 200 }
];

// ChartJS objektum
let myChart;

// Diagram inicializálása
function initChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
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

// Inicializálás az oldal betöltésekor
document.addEventListener('DOMContentLoaded', () => {
    initChart();
});