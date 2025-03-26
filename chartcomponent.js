import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const chartcomponent = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(entry => entry.date_sold),
          datasets: [
            {
              label: 'Houses Sold',
              data: data.map(entry => entry.price),
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'House Sales in Bulawayo',
            },
          },
        },
      });
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default chartcomponent;