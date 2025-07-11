import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setCharts } from '../store/analysisSlice';
import { 
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Area, AreaChart, ComposedChart,
  ReferenceLine, Brush
} from 'recharts';
import { 
  BarChart3, LineChart as LineChartIcon, Zap, PieChart as PieChartIcon,
  TrendingUp, Activity, Grid3X3, Filter
} from 'lucide-react';
import { createHistogramData, createBoxPlotData } from '../utils/dataProcessor';

const Visualizations: React.FC = () => {
  const dispatch = useDispatch();
  const { data, columns, columnTypes } = useSelector((state: RootState) => state.dataset);
  const { charts, correlationMatrix } = useSelector((state: RootState) => state.analysis);
  const [selectedChartTypes, setSelectedChartTypes] = useState<string[]>(['all']);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      const generatedCharts = generateAdvancedCharts(data, columns, columnTypes, correlationMatrix);
      dispatch(setCharts(generatedCharts));
    }
  }, [data, columns, columnTypes, correlationMatrix, dispatch]);

  const generateAdvancedCharts = (
    data: any[], 
    columns: string[], 
    columnTypes: Record<string, string>,
    correlationMatrix: Record<string, Record<string, number>>
  ) => {
    const charts: any[] = [];
    const numericColumns = columns.filter(col => columnTypes[col] === 'numeric');
    const categoricalColumns = columns.filter(col => columnTypes[col] === 'categorical');
    const booleanColumns = columns.filter(col => columnTypes[col] === 'boolean');
    const dateColumns = columns.filter(col => columnTypes[col] === 'date');

    // 1. Enhanced Histograms for numeric columns
    numericColumns.forEach(column => {
      const values = data.map(row => row[column]).filter(val => val !== null && !isNaN(val));
      if (values.length > 0) {
        const histogramData = createHistogramData(values, 25);
        charts.push({
          type: 'histogram' as const,
          column,
          data: histogramData,
          title: `Distribution of ${column}`,
          description: `Frequency distribution showing the spread of values in ${column}`,
        });
      }
    });

    // 2. Box plots for numeric columns
    numericColumns.forEach(column => {
      const values = data.map(row => row[column]).filter(val => val !== null && !isNaN(val));
      if (values.length > 0) {
        const boxPlotData = createBoxPlotData(values);
        if (boxPlotData) {
          charts.push({
            type: 'boxplot' as const,
            column,
            data: [boxPlotData],
            title: `Box Plot of ${column}`,
            description: `Shows quartiles, median, and outliers for ${column}`,
          });
        }
      }
    });

    // 3. Enhanced Bar charts for categorical columns
    categoricalColumns.forEach(column => {
      const valueCounts: Record<string, number> = {};
      data.forEach(row => {
        const val = row[column];
        if (val !== null && val !== '') {
          valueCounts[val] = (valueCounts[val] || 0) + 1;
        }
      });

      const sortedEntries = Object.entries(valueCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 15); // Show top 15 values

      if (sortedEntries.length > 0) {
        const chartData = sortedEntries.map(([value, count]) => ({
          name: value.length > 20 ? value.substring(0, 20) + '...' : value,
          value: count,
          percentage: ((count / data.length) * 100).toFixed(1),
          fullName: value,
        }));

        charts.push({
          type: 'bar' as const,
          column,
          data: chartData,
          title: `Top Values in ${column}`,
          description: `Frequency distribution of categorical values in ${column}`,
        });

        // Add pie chart for categorical data with fewer categories
        if (sortedEntries.length <= 8) {
          charts.push({
            type: 'pie' as const,
            column,
            data: chartData,
            title: `${column} Distribution (Pie Chart)`,
            description: `Proportional view of categories in ${column}`,
          });
        }
      }
    });

    // 4. Boolean distribution charts
    booleanColumns.forEach(column => {
      const booleanCounts = { true: 0, false: 0, null: 0 };
      data.forEach(row => {
        const val = row[column];
        if (val === true) booleanCounts.true++;
        else if (val === false) booleanCounts.false++;
        else booleanCounts.null++;
      });

      const chartData = [
        { name: 'True', value: booleanCounts.true, color: '#10b981' },
        { name: 'False', value: booleanCounts.false, color: '#ef4444' },
        ...(booleanCounts.null > 0 ? [{ name: 'Missing', value: booleanCounts.null, color: '#6b7280' }] : [])
      ];

      charts.push({
        type: 'pie' as const,
        column,
        data: chartData,
        title: `${column} Distribution`,
        description: `Boolean value distribution for ${column}`,
      });
    });

    // 5. Time series for date columns
    dateColumns.forEach(column => {
      const dateValues = data
        .map(row => ({ date: row[column], value: 1 }))
        .filter(item => item.date instanceof Date && !isNaN(item.date.getTime()))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      if (dateValues.length > 0) {
        // Group by month for better visualization
        const monthlyData: Record<string, number> = {};
        dateValues.forEach(item => {
          const monthKey = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, '0')}`;
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
        });

        const timeSeriesData = Object.entries(monthlyData).map(([month, count]) => ({
          month,
          count,
          date: new Date(month + '-01'),
        }));

        charts.push({
          type: 'line' as const,
          column,
          data: timeSeriesData,
          title: `${column} Time Series`,
          description: `Temporal distribution of dates in ${column}`,
          xAxis: 'month',
          yAxis: 'count',
        });
      }
    });

    // 6. Enhanced Scatter plots with trend lines
    for (let i = 0; i < numericColumns.length && charts.filter(c => c.type === 'scatter').length < 6; i++) {
      for (let j = i + 1; j < numericColumns.length && charts.filter(c => c.type === 'scatter').length < 6; j++) {
        const col1 = numericColumns[i];
        const col2 = numericColumns[j];
        
        const scatterData = data
          .filter(row => row[col1] !== null && row[col2] !== null && !isNaN(row[col1]) && !isNaN(row[col2]))
          .slice(0, 1000) // Limit points for performance
          .map(row => ({
            x: row[col1],
            y: row[col2],
          }));

        if (scatterData.length > 10) {
          const correlation = correlationMatrix[col1]?.[col2] || 0;
          charts.push({
            type: 'scatter' as const,
            column: `${col1} vs ${col2}`,
            data: scatterData,
            title: `${col1} vs ${col2}`,
            description: `Scatter plot showing relationship between ${col1} and ${col2} (r=${correlation.toFixed(3)})`,
            xAxis: col1,
            yAxis: col2,
          });
        }
      }
    }

    // 7. Correlation Heatmap
    if (numericColumns.length > 2) {
      const heatmapData = createHeatmapData(numericColumns, correlationMatrix);
      charts.push({
        type: 'heatmap' as const,
        column: 'Correlation Matrix',
        data: heatmapData,
        title: 'Correlation Heatmap',
        description: 'Correlation coefficients between all numeric variables',
        numericColumns,
      });
    }

    // 8. Multi-variable comparison (if we have categorical and numeric)
    if (categoricalColumns.length > 0 && numericColumns.length > 0) {
      const catCol = categoricalColumns[0];
      const numCol = numericColumns[0];
      
      const groupedData: Record<string, number[]> = {};
      data.forEach(row => {
        const catVal = row[catCol];
        const numVal = row[numCol];
        if (catVal !== null && numVal !== null && !isNaN(numVal)) {
          if (!groupedData[catVal]) groupedData[catVal] = [];
          groupedData[catVal].push(numVal);
        }
      });

      const comparisonData = Object.entries(groupedData)
        .slice(0, 10) // Limit categories
        .map(([category, values]) => ({
          category,
          mean: values.reduce((a, b) => a + b, 0) / values.length,
          count: values.length,
          min: Math.min(...values),
          max: Math.max(...values),
        }));

      if (comparisonData.length > 1) {
        charts.push({
          type: 'bar' as const,
          column: `${numCol} by ${catCol}`,
          data: comparisonData,
          title: `Average ${numCol} by ${catCol}`,
          description: `Comparison of ${numCol} values across different ${catCol} categories`,
        });
      }
    }

    return charts;
  };

  const createHeatmapData = (numericColumns: string[], correlationMatrix: Record<string, Record<string, number>>) => {
    const heatmapData: any[] = [];
    
    numericColumns.forEach((col1, i) => {
      numericColumns.forEach((col2, j) => {
        const correlation = correlationMatrix[col1]?.[col2] || 0;
        heatmapData.push({
          x: col1,
          y: col2,
          value: correlation,
          xIndex: i,
          yIndex: j,
          displayValue: correlation.toFixed(3),
        });
      });
    });

    return heatmapData;
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'histogram': return <BarChart3 size={20} color="#3b82f6" />;
      case 'bar': return <BarChart3 size={20} color="#10b981" />;
      case 'scatter': return <LineChartIcon size={20} color="#8b5cf6" />;
      case 'pie': return <PieChartIcon size={20} color="#f59e0b" />;
      case 'line': return <TrendingUp size={20} color="#06b6d4" />;
      case 'boxplot': return <Activity size={20} color="#ef4444" />;
      case 'heatmap': return <Grid3X3 size={20} color="#84cc16" />;
      default: return <BarChart3 size={20} color="#6b7280" />;
    }
  };

  const getCorrelationColor = (value: number) => {
    const intensity = Math.abs(value);
    const alpha = Math.max(0.1, intensity);
    
    if (value > 0) {
      return `rgba(59, 130, 246, ${alpha})`;
    } else {
      return `rgba(239, 68, 68, ${alpha})`;
    }
  };

  const getCorrelationTextColor = (value: number) => {
    const intensity = Math.abs(value);
    return intensity > 0.5 ? '#ffffff' : '#000000';
  };

  const filteredCharts = charts.filter(chart => {
    const typeMatch = selectedChartTypes.includes('all') || selectedChartTypes.includes(chart.type);
    const columnMatch = selectedColumns.length === 0 || 
      selectedColumns.some(col => chart.column.includes(col));
    return typeMatch && columnMatch;
  });

  const chartTypes = ['all', 'histogram', 'bar', 'scatter', 'pie', 'line', 'boxplot', 'heatmap'];
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  if (data.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
        <BarChart3 size={48} style={{ margin: '0 auto 16px' }} />
        <p>No data available for visualization. Please upload a CSV file first.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Advanced Data Visualizations
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={20} color="#6b7280" />
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {filteredCharts.length} of {charts.length} charts
          </span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Chart Types</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {chartTypes.map(type => (
              <button
                key={type}
                onClick={() => {
                  if (type === 'all') {
                    setSelectedChartTypes(['all']);
                  } else {
                    const newTypes = selectedChartTypes.includes('all') 
                      ? [type]
                      : selectedChartTypes.includes(type)
                        ? selectedChartTypes.filter(t => t !== type)
                        : [...selectedChartTypes.filter(t => t !== 'all'), type];
                    setSelectedChartTypes(newTypes.length === 0 ? ['all'] : newTypes);
                  }
                }}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: selectedChartTypes.includes(type) ? '#3b82f6' : '#ffffff',
                  color: selectedChartTypes.includes(type) ? '#ffffff' : '#374151',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Columns</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {columns.slice(0, 10).map(column => (
              <button
                key={column}
                onClick={() => {
                  setSelectedColumns(prev => 
                    prev.includes(column) 
                      ? prev.filter(c => c !== column)
                      : [...prev, column]
                  );
                }}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: selectedColumns.includes(column) ? '#10b981' : '#ffffff',
                  color: selectedColumns.includes(column) ? '#ffffff' : '#374151',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {column.length > 15 ? column.substring(0, 15) + '...' : column}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredCharts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
          <Zap size={48} style={{ margin: '0 auto 16px' }} />
          <p>No charts match the selected filters. Try adjusting your selection.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: '24px' }}>
          {filteredCharts.map((chart, index) => (
            <div 
              key={index}
              style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '12px', 
                padding: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {getChartIcon(chart.type)}
                    {chart.title}
                  </h3>
                  {chart.description && (
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      {chart.description}
                    </p>
                  )}
                </div>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  fontSize: '12px',
                  fontWeight: '500',
                  borderRadius: '4px',
                }}>
                  {chart.type}
                </span>
              </div>

              <div style={{ height: '400px', width: '100%' }}>
                {chart.type === 'histogram' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="range" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value, name) => [value, 'Frequency']}
                        labelFormatter={(label) => `Range: ${label}`}
                      />
                      <Bar dataKey="count" fill={colors[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {chart.type === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        labelFormatter={(label, payload) => {
                          const item = chart.data.find((d: any) => d.name === label);
                          return item ? item.fullName : label;
                        }}
                        formatter={(value, name) => [value, 'Count']}
                      />
                      <Bar dataKey="value">
                        {chart.data.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {chart.type === 'pie' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chart.data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage || ''}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chart.data.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {chart.type === 'scatter' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        tick={{ fontSize: 12 }}
                        name={chart.xAxis}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        tick={{ fontSize: 12 }}
                        name={chart.yAxis}
                      />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter dataKey="y" fill={colors[4]} />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}

                {chart.type === 'line' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey={chart.xAxis || 'month'} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey={chart.yAxis || 'count'} 
                        stroke={colors[5]} 
                        strokeWidth={2}
                        dot={{ fill: colors[5], strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {chart.type === 'boxplot' && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    {chart.data.map((boxData: any, index: number) => (
                      <div key={index} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                          Box Plot Statistics
                        </div>
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(3, 1fr)', 
                          gap: '12px',
                          fontSize: '12px'
                        }}>
                          <div>Min: {boxData.lowerWhisker?.toFixed(2)}</div>
                          <div>Q1: {boxData.q1?.toFixed(2)}</div>
                          <div>Median: {boxData.median?.toFixed(2)}</div>
                          <div>Q3: {boxData.q3?.toFixed(2)}</div>
                          <div>Max: {boxData.upperWhisker?.toFixed(2)}</div>
                          <div>Outliers: {boxData.outliers?.length || 0}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {chart.type === 'heatmap' && (
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    padding: '10px'
                  }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: `repeat(${chart.numericColumns.length}, 1fr)`,
                      gap: '2px',
                      flexGrow: 1,
                      aspectRatio: '1',
                      maxWidth: '100%',
                      maxHeight: '350px'
                    }}>
                      {chart.data.map((cell: any, index: number) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: getCorrelationColor(cell.value),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: Math.max(8, Math.min(12, 300 / chart.numericColumns.length)),
                            fontWeight: '600',
                            color: getCorrelationTextColor(cell.value),
                            border: '1px solid #e5e7eb',
                            borderRadius: '2px',
                            minHeight: '30px',
                            position: 'relative',
                          }}
                          title={`${cell.x} vs ${cell.y}: ${cell.displayValue}`}
                        >
                          {cell.displayValue}
                        </div>
                      ))}
                    </div>
                    
                    {/* Legend */}
                    <div style={{ 
                      marginTop: '10px', 
                      display: 'flex', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: 'rgba(239, 68, 68, 0.8)',
                          borderRadius: '2px'
                        }} />
                        <span>Negative</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: 'rgba(156, 163, 175, 0.3)',
                          borderRadius: '2px'
                        }} />
                        <span>Weak</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: 'rgba(59, 130, 246, 0.8)',
                          borderRadius: '2px'
                        }} />
                        <span>Positive</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Visualizations;