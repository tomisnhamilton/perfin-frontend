import { Chart } from "react-google-charts";

export default function SpendingByCategoryChart({ data }) {
    const chartData = [
        ["Category", "Amount"],
        ...data.map(item => [item.category, item.amount])
    ];

    return (
        <Chart
            chartType="PieChart"
            data={chartData}
            width="100%"
            height="400px"
            options={{ title: "Spending by Category" }}
        />
    );
}
