import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setStatistics, setCorrelationMatrix, setInsights, setDistributionAnalysis, setMissingValueAnalysis } from '../store/analysisSlice';
import { calculateStatistics, calculateCorrelation, generateInsights } from '../utils/dataProcessor';
import { saveAnalysis } from '../store/datasetSlice';
import { BarChart3, TrendingUp, AlertTriangle, Activity, Database, Target } from 'lucide-react';

const Statistics: React.FC = () => {
  const dispatch = useDispatch();
  const { data, columns, columnTypes, uploadId } = useSelector((state: RootState) => state.dataset);
  const { statistics, correlationMatrix, insights, distributionAnalysis, missingValueAnalysis } = useSelector((state: RootState) => state.analysis);

  useEffect(() => {
    if (data.length > 0) {
      const stats = calculateStatistics(data, columns, columnTypes);
      const numericColumns = columns.filter(col => columnTypes[col] === 'numeric');
      const corrMatrix = calculateCorrelation(data, numericColumns);
      const generatedInsights = generateInsights(stats, corrMatrix, columnTypes);

      // Calculate missing value analysis
      const missingAnalysis = calculateMissingValueAnalysis(data, columns);

      dispatch(setStatistics(stats));
      dispatch(setCorrelationMatrix(corrMatrix));
      dispatch(setInsights(generatedInsights));
      dispatch(setMissingValueAnalysis(missingAnalysis));

      // Save analysis to Firebase if we have an upload ID
      if (uploadId) {
        dispatch(saveAnalysis({
          uploadId,
          statistics: stats,
          insights: generatedInsights,
          correlationMatrix: corrMatrix,
          charts: [], // Charts will be saved separately
        }));
      }
    }
  }, [data, columns, columnTypes, uploadId, dispatch]);

  const calculateMissingValueAnalysis = (data: any[], columns: string[]) => {
    const missingByColumn: Record<string, number> = {};
    let totalMissing = 0;

    columns.forEach(column => {
      const missing = data.filter(row => row[column] === null || row[column] === undefined || row[column] === '').length;
      missingByColumn[column] = missing;
      totalMissing += missing;
    });

    return {
      totalMissing,
      missingByColumn,
      missingPatterns: [], // Could be enhanced with pattern analysis
    };
  };

  if (data.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
        <BarChart3 size={48} style={{ margin: '0 auto 16px' }} />
        <p>No data available for analysis. Please upload a CSV file first.</p>
      </div>
    );
  }

  const numericColumns = columns.filter(col => columnTypes[col] === 'numeric');
  const categoricalColumns = columns.filter(col => columnTypes[col] === 'categorical');
  const booleanColumns = columns.filter(col => columnTypes[col] === 'boolean');
  const dateColumns = columns.filter(col => columnTypes[col] === 'date');

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
        Advanced Statistical Analysis
      </h2>

      {/* Dataset Summary */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} color="#3b82f6" />
          Dataset Summary
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { label: 'Total Rows', value: data.length.toLocaleString(), color: '#3b82f6' },
            { label: 'Total Columns', value: columns.length, color: '#10b981' },
            { label: 'Numeric Columns', value: numericColumns.length, color: '#8b5cf6' },
            { label: 'Categorical Columns', value: categoricalColumns.length, color: '#f59e0b' },
            { label: 'Boolean Columns', value: booleanColumns.length, color: '#06b6d4' },
            { label: 'Date Columns', value: dateColumns.length, color: '#84cc16' },
          ].map(item => (
            <div key={item.label} style={{ 
              padding: '16px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              borderLeft: `4px solid ${item.color}`
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: item.color }}>
                {item.value}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      {insights.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="#f59e0b" />
            Key Insights ({insights.length})
          </h3>
          <div style={{ 
            backgroundColor: '#fffbeb', 
            border: '1px solid #fed7aa', 
            borderRadius: '8px', 
            padding: '16px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {insights.map((insight, index) => (
              <p key={index} style={{ margin: '8px 0', fontSize: '14px', color: '#92400e', lineHeight: '1.5' }}>
                {insight}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Missing Value Analysis */}
      {missingValueAnalysis.totalMissing > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="#ef4444" />
            Missing Value Analysis
          </h3>
          <div style={{ 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '8px', 
            padding: '16px' 
          }}>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#dc2626' }}>
              Total Missing Values: {missingValueAnalysis.totalMissing.toLocaleString()}
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '8px'
            }}>
              {Object.entries(missingValueAnalysis.missingByColumn)
                .filter(([_, count]) => count > 0)
                .sort(([,a], [,b]) => b - a)
                .map(([column, count]) => {
                  const percentage = ((count / data.length) * 100).toFixed(1);
                  return (
                    <div key={column} style={{ 
                      padding: '8px 12px',
                      backgroundColor: '#ffffff',
                      borderRadius: '4px',
                      border: '1px solid #f3f4f6'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>{column}</div>
                      <div style={{ fontSize: '12px', color: '#dc2626' }}>
                        {count} missing ({percentage}%)
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Numeric Statistics */}
      {numericColumns.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#3b82f6" />
            Numeric Variables ({numericColumns.length})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  {[
                    'Column', 'Count', 'Missing', 'Mean', 'Std', 'Min', 'Q1', 'Median', 'Q3', 'Max', 
                    'Range', 'IQR', 'Skewness', 'Kurtosis', 'Outliers'
                  ].map(header => (
                    <th key={header} style={{ 
                      padding: '12px 8px', 
                      textAlign: header === 'Column' ? 'left' : 'right', 
                      borderBottom: '1px solid #e5e7eb', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      minWidth: header === 'Column' ? '120px' : '80px'
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {numericColumns.map(column => {
                  const stats = statistics[column];
                  return (
                    <tr key={column} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: '500' }}>{column}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px' }}>{stats?.count || 0}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px', color: stats?.missing > 0 ? '#dc2626' : '#111827' }}>
                        {stats?.missing || 0}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px' }}>
                        {stats?.mean ? stats.mean.toFixed(3) : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px' }}>
                        {stats?.std ? stats.std.toFixed(3) : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px' }}>
                        {stats?.min !== undefined ? stats.min.toFixed(3) : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px' }}>
                        {stats?.q1 ? stats.q1.toFixed(3) : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px' }}>
                        {stats?.median ? stats.median.toFixed(3) : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px' }}>
                        {stats?.q3 ? stats.q3.toFixed(3) : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px' }}>
                        {stats?.max !== undefined ? stats.max.toFixed(3) : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px' }}>
                        {stats?.range ? stats.range.toFixed(3) : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px' }}>
                        {stats?.iqr ? stats.iqr.toFixed(3) : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px', color: Math.abs(stats?.skewness || 0) > 1 ? '#dc2626' : '#111827' }}>
                        {stats?.skewness ? stats.skewness.toFixed(3) : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px' }}>
                        {stats?.kurtosis ? stats.kurtosis.toFixed(3) : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px', color: stats?.outliers > 0 ? '#dc2626' : '#111827' }}>
                        {stats?.outliers || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categorical Statistics */}
      {categoricalColumns.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Categorical Variables ({categoricalColumns.length})
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {categoricalColumns.map(column => {
              const stats = statistics[column];
              const uniqueRatio = stats?.unique ? (stats.unique / stats.count * 100).toFixed(1) : '0';
              return (
                <div 
                  key={column}
                  style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    padding: '16px',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                    {column}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Count:</span>
                      <span style={{ fontWeight: '500' }}>{stats?.count || 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Missing:</span>
                      <span style={{ fontWeight: '500', color: stats?.missing > 0 ? '#dc2626' : '#111827' }}>
                        {stats?.missing || 0}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Unique:</span>
                      <span style={{ fontWeight: '500' }}>{stats?.unique || 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Cardinality:</span>
                      <span style={{ fontWeight: '500', color: parseFloat(uniqueRatio) > 90 ? '#dc2626' : '#111827' }}>
                        {uniqueRatio}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gridColumn: '1 / -1' }}>
                      <span style={{ color: '#6b7280' }}>Mode:</span>
                      <span style={{ fontWeight: '500', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {stats?.mode || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Boolean Statistics */}
      {booleanColumns.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Boolean Variables ({booleanColumns.length})
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {booleanColumns.map(column => {
              const stats = statistics[column];
              return (
                <div 
                  key={column}
                  style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    padding: '16px',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                    {column}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>True:</span>
                      <span style={{ fontWeight: '500', color: '#10b981' }}>{stats?.trueCount || 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>False:</span>
                      <span style={{ fontWeight: '500', color: '#ef4444' }}>{stats?.falseCount || 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Missing:</span>
                      <span style={{ fontWeight: '500' }}>{stats?.missing || 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>True Ratio:</span>
                      <span style={{ fontWeight: '500' }}>
                        {stats?.trueRatio ? (stats.trueRatio * 100).toFixed(1) + '%' : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Correlation Matrix */}
      {numericColumns.length > 1 && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#3b82f6" />
            Correlation Matrix ({numericColumns.length}×{numericColumns.length})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px', fontWeight: '600' }}>
                    Variable
                  </th>
                  {numericColumns.map(col => (
                    <th 
                      key={col}
                      style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        borderBottom: '1px solid #e5e7eb', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        minWidth: '80px',
                        maxWidth: '100px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={col}
                    >
                      {col.length > 10 ? col.substring(0, 10) + '...' : col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {numericColumns.map(row => (
                  <tr key={row} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row}>
                      {row}
                    </td>
                    {numericColumns.map(col => {
                      const corr = correlationMatrix[row]?.[col] || 0;
                      const absCorr = Math.abs(corr);
                      let bgColor = '#f9fafb';
                      let textColor = '#111827';
                      
                      if (row === col) {
                        bgColor = '#e5e7eb';
                        textColor = '#374151';
                      } else if (absCorr > 0.8) {
                        bgColor = corr > 0 ? '#dbeafe' : '#fecaca';
                        textColor = corr > 0 ? '#1d4ed8' : '#dc2626';
                      } else if (absCorr > 0.5) {
                        bgColor = corr > 0 ? '#e0f2fe' : '#fee2e2';
                        textColor = corr > 0 ? '#0369a1' : '#b91c1c';
                      } else if (absCorr > 0.3) {
                        bgColor = corr > 0 ? '#f0f9ff' : '#fef2f2';
                        textColor = corr > 0 ? '#0284c7' : '#dc2626';
                      }

                      return (
                        <td 
                          key={col}
                          style={{ 
                            padding: '12px', 
                            textAlign: 'center', 
                            fontSize: '12px',
                            backgroundColor: bgColor,
                            color: textColor,
                            fontWeight: '600'
                          }}
                          title={`${row} vs ${col}: ${corr.toFixed(4)}`}
                        >
                          {corr.toFixed(3)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
            <strong>Legend:</strong> Strong correlation (|r| {'>'} 0.8), Moderate correlation (|r| {'>'} 0.5), Weak correlation (|r| {'>'} 0.3)
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;