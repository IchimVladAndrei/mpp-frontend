import axios from 'axios';
import Chart from 'chart.js/auto';
import {useEffect, useRef, useState} from 'react';

export default function Stats() {
    const chartRef = useRef<Chart | null>(null);
    const [prices, setPrices] = useState<number[]>([]);
    type Car = {
        id: number;
        brand: string;
        price: number;
        yearBought: number;
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/cars',
                );
                const fetchedCars = response.data;
                const getPrice = fetchedCars.map((car: Car) => car.price);
                setPrices(getPrice);
            } catch (error) {
                console.error('error on get Cars', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const cnvs = document.getElementById('carsStats');

        const intervals: {[key: string]: number} = {
            '<10K': 0,
            '10K-100K': 0,
            '100K-1M': 0,
            '>1M': 0,
        };

        prices.forEach((price) => {
            if (price < 10) intervals['<10K']++;
            else if (price >= 10 && price < 100) intervals['10K-100K']++;
            else if (price >= 100 && price < 100000) intervals['100K-1M']++;
            else if (price >= 100000) intervals['>1M']++;
        });

        if (chartRef.current) {
            chartRef.current.destroy();
        }
        if (cnvs) {
            const newChart = new Chart(cnvs, {
                type: 'bar',
                data: {
                    labels: Object.keys(intervals),
                    datasets: [
                        {
                            label: 'Car prices',
                            data: Object.values(intervals),
                            backgroundColor: ['rgba(255, 99, 132, 1)'],
                            borderColor: ['rgba(255, 99, 132, 1)'],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
            chartRef.current = newChart;
        }
    }, [prices]);

    return (
        <div>
            <h1>Cars Selling Price Stats</h1>
            <canvas id='carsStats' width='512' height='512'></canvas>
        </div>
    );
}
