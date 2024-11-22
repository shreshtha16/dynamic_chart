// script.js

// API details for fetching cryptocurrency prices
const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd';

// Chart.js setup
const ctx = document.getElementById('liveChart').getContext('2d');
const chartData = {
  labels: [],
  datasets: [
    {
      label: 'Bitcoin (BTC)',
      data: [],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
      tension: 0.4,
    },
    {
      label: 'Ethereum (ETH)',
      data: [],
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: false,
      tension: 0.4,
    },
  ],
};

// Create the Chart
const liveChart = new Chart(ctx, {
  type: 'line',
  data: chartData,
  options: {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)',
        },
      },
    },
  },
});

// Update chart with animation using Anime.js
const animateChart = (newDataBTC, newDataETH, timestamp) => {
  anime({
    targets: chartData.datasets[0].data,
    value: newDataBTC,
    round: 1,
    easing: 'easeInOutQuad',
    duration: 1000,
    update: () => liveChart.update('none'), // Skip built-in animation
  });

  anime({
    targets: chartData.datasets[1].data,
    value: newDataETH,
    round: 1,
    easing: 'easeInOutQuad',
    duration: 1000,
    update: () => liveChart.update('none'),
  });

  // Add timestamp to labels
  chartData.labels.push(timestamp);
  if (chartData.labels.length > 10) {
    chartData.labels.shift(); // Maintain 10 points max
    chartData.datasets[0].data.shift();
    chartData.datasets[1].data.shift();
  }
};

// Fetch data and update chart
const fetchData = async () => {
  const statusElement = document.querySelector('.status p');
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const btcPrice = data.bitcoin.usd;
    const ethPrice = data.ethereum.usd;
    const currentTime = new Date().toLocaleTimeString();

    statusElement.textContent = 'Data updated successfully!';
    animateChart([btcPrice], [ethPrice], currentTime);
  } catch (error) {
    statusElement.textContent = 'Error fetching data.';
    console.error('Error fetching data:', error);
  }
};

// Fetch data every 5 seconds
setInterval(fetchData, 5000);

// Initial fetch
fetchData();
