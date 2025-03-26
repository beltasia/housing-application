// Chart instances
let salesChart, statusChart;

// Initialize charts
export function initializeCharts() {
  salesChart = createChart(
    'salesChart', 
    'line', 
    'Monthly Sales Trend', 
    ['rgba(75, 192, 192, 1)'], 
    'rgba(75, 192, 192, 0.2)'
  );
  
  statusChart = createChart(
    'statusChart', 
    'doughnut', 
    'Property Status', 
    ['rgba(54, 162, 235, 0.7)', 'rgba(255, 159, 64, 0.7)']
  );
}

// Create chart configuration
function createChart(elementId, type, label, bgColors, borderColor = null) {
  const ctx = document.getElementById(elementId).getContext('2d');
  return new Chart(ctx, {
    type: type,
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        backgroundColor: bgColors,
        borderColor: borderColor || bgColors,
        borderWidth: borderColor ? 1 : 0
      }]
    },
    options: getChartOptions(type)
  });
}

// Get chart-specific options
function getChartOptions(type) {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: type === 'doughnut' ? 'bottom' : 'top',
      }
    }
  };

  if (type === 'line') {
    commonOptions.scales = {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    };
  }

  return commonOptions;
}

// Update charts with new data
export function updateCharts(properties) {
  updateSalesChart(properties);
  updateStatusChart(properties);
}

function updateSalesChart(properties) {
  const monthlyData = groupByMonth(properties);
  
  salesChart.data.labels = Object.keys(monthlyData).map(month => 
    new Date(month).toLocaleString('default', { month: 'short', year: 'numeric' })
  );
  
  salesChart.data.datasets[0].data = Object.values(monthlyData);
  salesChart.update();
}

function updateStatusChart(properties) {
  const statusData = {
    'For Sale': properties.filter(p => p.status === 'for_sale').length,
    'Sold': properties.filter(p => p.status === 'sold').length
  };
  
  statusChart.data.labels = Object.keys(statusData);
  statusChart.data.datasets[0].data = Object.values(statusData);
  statusChart.update();
}

// Helper function to group properties by month
function groupByMonth(properties) {
  return properties.reduce((acc, property) => {
    const monthYear = `${property.date_listed.getFullYear()}-${property.date_listed.getMonth()}`;
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {});
}
