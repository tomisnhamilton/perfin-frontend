import { Chart } from "react-google-charts";

export default function BalanceTrendChart({ data }) {
    const chartData = [
        ['Date', 'Balance'],
        ...data.map(item => [
            new Date(item.date),                              // convert string to Date
            Number.isFinite(item.balance) ? item.balance : 0  // guard against NaN
        ]),
    ];

    if (chartData.length === 1) return null; // Don't render with no data

    return (
        <Chart
            chartType="LineChart"
            data={chartData}
            width="100%"
            height="400px"
            options={{
                title: 'Balance Trend Over Time',
                hAxis: { title: 'Date', format: 'MMM d' },
                vAxis: { title: 'Balance' },
                legend: 'none',
            }}
        />
    );
}
