import { Table, PivotTable, CrossTab, Aggregations } from '../src';

console.log('--- Data Analysis Features Demo ---\n');

// Sample Data: Sales Records
const salesData = [
    { Region: 'North', Product: 'Laptop', Amount: 1200, Month: 'Jan' },
    { Region: 'North', Product: 'Mouse', Amount: 25, Month: 'Jan' },
    { Region: 'South', Product: 'Laptop', Amount: 1100, Month: 'Jan' },
    { Region: 'South', Product: 'Keyboard', Amount: 80, Month: 'Feb' },
    { Region: 'North', Product: 'Laptop', Amount: 1250, Month: 'Feb' },
    { Region: 'East', Product: 'Mouse', Amount: 30, Month: 'Feb' },
    { Region: 'West', Product: 'Monitor', Amount: 300, Month: 'Jan' },
    { Region: 'West', Product: 'Laptop', Amount: 1300, Month: 'Feb' }
];

console.log('1. Pivot Table: Total Sales by Region');
// Group by Region, Sum Amount
const pivot1 = PivotTable.create(salesData, {
    groupBy: 'Region',
    targetColumn: 'Amount',
    algorithm: 'sum',
});
pivot1.responsiveMode = 'hide'; // Add responsive mode
console.log(pivot1.render());

console.log('\n2. Crosstab: Product Sales per Month (Matrix)');
// Rows: Product, Cols: Month, Value: Sum of Amount
const cross1 = CrossTab.create(salesData, {
    rowKey: 'Product',
    colKey: 'Month',
    valueKey: 'Amount',
    aggregator: 'sum',
    missingValue: 0 // Show 0 instead of '-'
});
cross1.responsiveMode = 'hide'; // Add responsive mode
console.log(cross1.render());

console.log('\n3. Advanced Aggregations (Stats)');
const amounts = salesData.map(s => s.Amount);

const statsTable = new Table({ responsiveMode: 'hide' }); // Add responsive mode
statsTable.addColumn('Metric');
statsTable.addColumn('Value');

statsTable.addRow({ Metric: 'Total Revenue', Value: Aggregations.sum(amounts) });
statsTable.addRow({ Metric: 'Average Sale', Value: Aggregations.avg(amounts) });
statsTable.addRow({ Metric: 'Min Sale', Value: Aggregations.min(amounts) });
statsTable.addRow({ Metric: 'Max Sale', Value: Aggregations.max(amounts) });
statsTable.addRow({ Metric: 'Std Deviation', Value: Aggregations.stdDev(amounts) });
statsTable.addRow({ Metric: '90th Percentile', Value: Aggregations.percentile(amounts, 0.9) });

console.log(statsTable.render());

console.log('\n4. Custom Logic: Max Sale per Region');
// Custom aggregation function
const maxPivot = PivotTable.create(salesData, {
    groupBy: 'Region',
    targetColumn: 'Amount',
    algorithm: (values) => Math.max(...values) // Custom arrow function
});
// Rename column for display (PivotTable uses generic keys)
maxPivot.columns[1].name = 'Max Sale';
maxPivot.responsiveMode = 'hide'; // Add responsive mode
console.log(maxPivot.render());
