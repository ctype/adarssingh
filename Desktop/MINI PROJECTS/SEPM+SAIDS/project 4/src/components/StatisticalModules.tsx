import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BoxPlot, ViolinPlot, Histogram
} from 'recharts';
import {
  Calculator, TrendingUp, BarChart3, PieChart, Activity,
  Target, Zap, Database, FileText, Brain
} from 'lucide-react';
import {
  classifyVariable,
  createFrequencyTable,
  calculateDescriptiveStats,
  fitDistribution,
  performTTest,
  performOneWayANOVA,
  performLinearRegression,
  decomposeTimeSeries,
  analyzeText,
  createTfIdfMatrix
} from '../utils/statisticalAnalysis';

const StatisticalModules: React.FC = () => {
  const { data, columns, columnTypes } = useSelector((state: RootState) => state.dataset);
  const [activeModule, setActiveModule] = useState('data-sampling');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<any>({});

  const modules = [
    { id: 'data-sampling', name: 'Data & Sampling', icon: Database },
    { id: 'data-summary', name: 'Data Summary', icon: Calculator },
    { id: 'probability', name: 'Probability & Distributions', icon: TrendingUp },
    { id: 'hypothesis', name: 'Hypothesis Testing', icon: Target },
    { id: 'anova', name: 'ANOVA', icon: BarChart3 },
    { id: 'regression', name: 'Correlation & Regression', icon: Activity },
    { id: 'time-series', name: 'Time Series', icon: LineChart },
    { id: 'text-analytics', name: 'Text Analytics', icon: FileText }
  ];

  useEffect(() => {
    if (selectedColumn && data.length > 0) {
      performAnalysis();
    }
  }, [selectedColumn, activeModule, data]);

  const performAnalysis = () => {
    if (!selectedColumn || data.length === 0) return;

    const columnData = data.map(row => row[selectedColumn]).filter(val => val !== null);
    const numericData = columnData.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));

    try {
      switch (activeModule) {
        case 'data-sampling':
          setAnalysisResults({
            classification: classifyVariable(columnData),
            frequencyTable: createFrequencyTable(columnData),
            sampleSize: columnData.length,
            populationEstimate: columnData.length * 10 // Simulated
          });
          break;

        case 'data-summary':
          if (numericData.length > 0) {
            setAnalysisResults(calculateDescriptiveStats(numericData));
          }
          break;

        case 'probability':
          if (numericData.length > 0) {
            setAnalysisResults({
              distributions: fitDistribution(numericData),
              basicStats: {
                mean: numericData.reduce((a, b) => a + b, 0) / numericData.length,
                variance: calculateVariance(numericData)
              }
            });
          }
          break;

        case 'hypothesis':
          if (numericData.length > 0) {
            setAnalysisResults({
              tTest: performTTest(numericData, undefined, 0, 0.05),
              sampleSize: numericData.length
            });
          }
          break;

        case 'regression':
          const numericColumns = columns.filter(col => columnTypes[col] === 'numeric');
          if (numericColumns.length >= 2) {
            const xData = data.map(row => parseFloat(row[numericColumns[0]])).filter(val => !isNaN(val));
            const yData = data.map(row => parseFloat(row[numericColumns[1]])).filter(val => !isNaN(val));
            if (xData.length === yData.length && xData.length > 0) {
              setAnalysisResults(performLinearRegression(xData, yData));
            }
          }
          break;

        case 'text-analytics':
          if (columnTypes[selectedColumn] === 'categorical') {
            const textData = columnData.filter(val => typeof val === 'string');
            if (textData.length > 0) {
              setAnalysisResults({
                textAnalysis: analyzeText(textData.join(' ')),
                tfidf: createTfIdfMatrix(textData.slice(0, 10))
              });
            }
          }
          break;
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResults({ error: error.message });
    }
  };

  const calculateVariance = (data: number[]): number => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
  };

  if (data.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
        <Brain size={64} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
        <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Statistical Analysis Modules</h3>
        <p>Upload a dataset to access comprehensive statistical analysis tools</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>
        Advanced Statistical Analysis Platform
      </h2>

      {/* Module Navigation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {modules.map(module => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px',
                border: `2px solid ${isActive ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '10px',
                backgroundColor: isActive ? '#eff6ff' : '#ffffff',
                color: isActive ? '#1d4ed8' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                fontWeight: '600'
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#9ca3af';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              <Icon size={20} />
              {module.name}
            </button>
          );
        })}
      </div>

      {/* Column Selection */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
          Select Variable for Analysis
        </h3>
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px',
            backgroundColor: '#ffffff'
          }}
        >
          <option value="">Select a column...</option>
          {columns.map(column => (
            <option key={column} value={column}>
              {column} ({columnTypes[column]})
            </option>
          ))}
        </select>
      </div>

      {/* Analysis Results */}
      {selectedColumn && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '30px'
        }}>
          <h3 style={{
            fontSize: '22px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#1f2937'
          }}>
            {modules.find(m => m.id === activeModule)?.name} - {selectedColumn}
          </h3>

          {renderModuleContent()}
        </div>
      )}
    </div>
  );

  function renderModuleContent() {
    if (!analysisResults || Object.keys(analysisResults).length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <Zap size={48} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
          <p>Performing analysis...</p>
        </div>
      );
    }

    if (analysisResults.error) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626'
        }}>
          <strong>Error:</strong> {analysisResults.error}
        </div>
      );
    }

    switch (activeModule) {
      case 'data-sampling':
        return renderDataSamplingModule();
      case 'data-summary':
        return renderDataSummaryModule();
      case 'probability':
        return renderProbabilityModule();
      case 'hypothesis':
        return renderHypothesisModule();
      case 'regression':
        return renderRegressionModule();
      case 'text-analytics':
        return renderTextAnalyticsModule();
      default:
        return <div>Module content not implemented yet.</div>;
    }
  }

  function renderDataSamplingModule() {
    const { classification, frequencyTable, sampleSize, populationEstimate } = analysisResults;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Variable Classification */}
        <div>
          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
            Variable Classification
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
              <strong>Type:</strong> {classification.variableType}
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px' }}>
              <strong>Level:</strong> {classification.dataLevel}
            </div>
            <div style={{ padding: '12px', backgroundColor: '#fefce8', borderRadius: '6px' }}>
              <strong>Source:</strong> {classification.dataSource}
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>
              Sample Information
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {sampleSize}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Sample Size</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  {populationEstimate}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Est. Population</div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequency Table */}
        <div>
          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
            Frequency Distribution
          </h4>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '8px', border: '1px solid #e5e7eb', textAlign: 'left' }}>Value</th>
                  <th style={{ padding: '8px', border: '1px solid #e5e7eb', textAlign: 'right' }}>Frequency</th>
                  <th style={{ padding: '8px', border: '1px solid #e5e7eb', textAlign: 'right' }}>Relative %</th>
                  <th style={{ padding: '8px', border: '1px solid #e5e7eb', textAlign: 'right' }}>Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {frequencyTable.slice(0, 20).map((row, index) => (
                  <tr key={index}>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb' }}>
                      {typeof row.value === 'number' ? row.value.toFixed(2) : row.value}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb', textAlign: 'right' }}>
                      {row.frequency}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb', textAlign: 'right' }}>
                      {(row.relativeFrequency * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #e5e7eb', textAlign: 'right' }}>
                      {row.cumulativeFrequency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function renderDataSummaryModule() {
    const stats = analysisResults;

    return (
      <div>
        {/* Central Tendency */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
            Measures of Central Tendency
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            <div style={{ padding: '20px', backgroundColor: '#eff6ff', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1d4ed8' }}>
                {stats.mean?.toFixed(3)}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Mean</div>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669' }}>
                {stats.median?.toFixed(3)}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Median</div>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#fef3c7', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d97706' }}>
                {typeof stats.mode === 'number' ? stats.mode.toFixed(3) : stats.mode}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Mode</div>
            </div>
          </div>
        </div>

        {/* Variability */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
            Measures of Variability
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
            {[
              { label: 'Range', value: stats.range, color: '#dc2626' },
              { label: 'Variance', value: stats.variance, color: '#7c3aed' },
              { label: 'Std Dev', value: stats.standardDeviation, color: '#059669' },
              { label: 'IQR', value: stats.q3 - stats.q1, color: '#ea580c' }
            ].map((item, index) => (
              <div key={index} style={{
                padding: '15px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                textAlign: 'center',
                border: `2px solid ${item.color}20`
              }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: item.color }}>
                  {item.value?.toFixed(3)}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shape */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
            Distribution Shape
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#fef2f2', borderRadius: '10px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', textAlign: 'center' }}>
                {stats.skewness?.toFixed(3)}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', marginBottom: '10px' }}>
                Skewness
              </div>
              <div style={{ fontSize: '12px', color: '#374151' }}>
                {Math.abs(stats.skewness) < 0.5 ? 'Approximately symmetric' :
                 stats.skewness > 0 ? 'Right-skewed (positive)' : 'Left-skewed (negative)'}
              </div>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '10px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', textAlign: 'center' }}>
                {stats.kurtosis?.toFixed(3)}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', marginBottom: '10px' }}>
                Kurtosis
              </div>
              <div style={{ fontSize: '12px', color: '#374151' }}>
                {stats.kurtosis > 3 ? 'Leptokurtic (heavy tails)' :
                 stats.kurtosis < 3 ? 'Platykurtic (light tails)' : 'Mesokurtic (normal)'}
              </div>
            </div>
          </div>
        </div>

        {/* Quartiles */}
        <div>
          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
            Quartiles & Percentiles
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {[
              { label: 'Min', value: Math.min(...Object.values(stats.percentiles || {})) },
              { label: 'Q1', value: stats.q1 },
              { label: 'Q2 (Median)', value: stats.median },
              { label: 'Q3', value: stats.q3 },
              { label: 'Max', value: Math.max(...Object.values(stats.percentiles || {})) }
            ].map((item, index) => (
              <div key={index} style={{
                padding: '12px',
                backgroundColor: '#f3f4f6',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151' }}>
                  {item.value?.toFixed(2)}
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>{item.label}</div>
              </div>
            ))}
          </div>
          
          {stats.outliers && stats.outliers.length > 0 && (
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
              <strong style={{ color: '#dc2626' }}>Outliers Detected:</strong> {stats.outliers.length} values
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
                {stats.outliers.slice(0, 10).map(val => val.toFixed(2)).join(', ')}
                {stats.outliers.length > 10 && '...'}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderProbabilityModule() {
    const { distributions, basicStats } = analysisResults;

    return (
      <div>
        <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          Distribution Fitting Analysis
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Distribution Results */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
              Best Fit Distributions
            </h5>
            {distributions?.map((dist, index) => (
              <div key={index} style={{
                padding: '15px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#1f2937', textTransform: 'capitalize' }}>
                    {dist.distribution} Distribution
                  </strong>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: dist.goodnessOfFit > 0.5 ? '#dcfce7' : '#fef2f2',
                    color: dist.goodnessOfFit > 0.5 ? '#166534' : '#dc2626',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Fit: {(dist.goodnessOfFit * 100).toFixed(1)}%
                  </span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#6b7280' }}>
                  <strong>Parameters:</strong>
                  {Object.entries(dist.parameters).map(([key, value]) => (
                    <span key={key} style={{ marginLeft: '10px' }}>
                      {key}: {value.toFixed(3)}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
                  p-value: {dist.pValue.toFixed(4)}
                </div>
              </div>
            ))}
          </div>

          {/* Basic Probability Stats */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
              Probability Statistics
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1d4ed8' }}>
                  {basicStats?.mean?.toFixed(3)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Expected Value (μ)</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>
                  {basicStats?.variance?.toFixed(3)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Variance (σ²)</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#fefce8', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d97706' }}>
                  {Math.sqrt(basicStats?.variance || 0).toFixed(3)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Standard Deviation (σ)</div>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Distribution Properties
              </h6>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>
                • <strong>Continuous:</strong> Data can take any value within a range<br/>
                • <strong>Normal Distribution:</strong> Bell-shaped, symmetric curve<br/>
                • <strong>Poisson Distribution:</strong> Models count data and rare events<br/>
                • <strong>Goodness of Fit:</strong> How well the distribution matches your data
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderHypothesisModule() {
    const { tTest, sampleSize } = analysisResults;

    return (
      <div>
        <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          Hypothesis Testing Results
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Test Setup */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
              Test Configuration
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
                <strong>Test Type:</strong> {tTest?.testType}
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px' }}>
                <strong>Sample Size:</strong> {sampleSize}
              </div>
              <div style={{ padding: '12px', backgroundColor: '#fefce8', borderRadius: '6px' }}>
                <strong>Significance Level:</strong> α = 0.05
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Hypotheses
              </h6>
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>H₀:</strong> {tTest?.nullHypothesis}
                </div>
                <div>
                  <strong>H₁:</strong> {tTest?.alternativeHypothesis}
                </div>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
              Test Statistics
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d4ed8' }}>
                  {tTest?.testStatistic?.toFixed(4)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Test Statistic (t)</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                  {tTest?.pValue?.toFixed(4)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>p-value</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#fef2f2', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                  ±{tTest?.criticalValue?.toFixed(4)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Critical Value</div>
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: tTest?.pValue < 0.05 ? '#fef2f2' : '#f0fdf4',
              borderRadius: '8px',
              border: `2px solid ${tTest?.pValue < 0.05 ? '#fecaca' : '#bbf7d0'}`
            }}>
              <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Conclusion
              </h6>
              <div style={{
                color: tTest?.pValue < 0.05 ? '#dc2626' : '#059669',
                fontWeight: '600'
              }}>
                {tTest?.conclusion}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                {tTest?.pValue < 0.05 
                  ? 'The result is statistically significant at α = 0.05'
                  : 'The result is not statistically significant at α = 0.05'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Interpretation Guide */}
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '10px' }}>
          <h6 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
            Interpretation Guide
          </h6>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
            <div>
              <strong>p-value Interpretation:</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '20px', color: '#6b7280' }}>
                <li>p &lt; 0.01: Very strong evidence against H₀</li>
                <li>0.01 ≤ p &lt; 0.05: Strong evidence against H₀</li>
                <li>0.05 ≤ p &lt; 0.10: Weak evidence against H₀</li>
                <li>p ≥ 0.10: Little or no evidence against H₀</li>
              </ul>
            </div>
            <div>
              <strong>Type I & II Errors:</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '20px', color: '#6b7280' }}>
                <li><strong>Type I:</strong> Rejecting true H₀ (α = 0.05)</li>
                <li><strong>Type II:</strong> Failing to reject false H₀</li>
                <li><strong>Power:</strong> Probability of correctly rejecting false H₀</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderRegressionModule() {
    const regression = analysisResults;

    return (
      <div>
        <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          Linear Regression Analysis
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Regression Equation */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
              Regression Equation
            </h5>
            <div style={{
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              textAlign: 'center',
              border: '2px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                ŷ = {regression.intercept?.toFixed(3)} + {regression.slope?.toFixed(3)}x
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Predicted Y = Intercept + Slope × X
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Model Coefficients
              </h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px' }}>
                  <strong>Intercept (b₀):</strong> {regression.intercept?.toFixed(4)}
                </div>
                <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px' }}>
                  <strong>Slope (b₁):</strong> {regression.slope?.toFixed(4)}
                </div>
                <div style={{ padding: '12px', backgroundColor: '#fefce8', borderRadius: '6px' }}>
                  <strong>Standard Error:</strong> {regression.standardError?.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          {/* Model Performance */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
              Model Performance
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1d4ed8' }}>
                  {(regression.rSquared * 100)?.toFixed(1)}%
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>R-squared</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Variance Explained
                </div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669' }}>
                  {regression.correlation?.toFixed(3)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Correlation (r)</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Linear Relationship
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Model Interpretation
              </h6>
              <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>
                • <strong>R²:</strong> {(regression.rSquared * 100)?.toFixed(1)}% of variance in Y is explained by X<br/>
                • <strong>Correlation:</strong> {Math.abs(regression.correlation) > 0.7 ? 'Strong' : Math.abs(regression.correlation) > 0.3 ? 'Moderate' : 'Weak'} {regression.correlation > 0 ? 'positive' : 'negative'} relationship<br/>
                • <strong>Slope:</strong> For each unit increase in X, Y {regression.slope > 0 ? 'increases' : 'decreases'} by {Math.abs(regression.slope)?.toFixed(3)} units
              </div>
            </div>
          </div>
        </div>

        {/* Residual Analysis */}
        {regression.residuals && (
          <div style={{ marginTop: '30px' }}>
            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
              Residual Analysis
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#7c3aed' }}>
                  {regression.residuals.length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Data Points</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>
                  {(regression.residuals.reduce((sum, r) => sum + Math.abs(r), 0) / regression.residuals.length).toFixed(3)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Mean Abs Error</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>
                  {Math.sqrt(regression.residuals.reduce((sum, r) => sum + r*r, 0) / regression.residuals.length).toFixed(3)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>RMSE</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderTextAnalyticsModule() {
    const { textAnalysis, tfidf } = analysisResults;

    return (
      <div>
        <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          Text Analytics Results
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Basic Text Statistics */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
              Text Statistics
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d4ed8' }}>
                  {textAnalysis?.wordCount}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Words</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                  {textAnalysis?.uniqueWords}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Unique Words</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#fefce8', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
                  {textAnalysis?.averageWordLength?.toFixed(1)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Avg Word Length</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#fef2f2', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                  {textAnalysis?.readabilityScore?.toFixed(0)}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Readability Score</div>
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div style={{ marginTop: '20px' }}>
              <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Sentiment Analysis
              </h6>
              <div style={{
                padding: '15px',
                backgroundColor: textAnalysis?.sentiment === 'positive' ? '#f0fdf4' : 
                                textAnalysis?.sentiment === 'negative' ? '#fef2f2' : '#f9fafb',
                borderRadius: '8px',
                border: `2px solid ${textAnalysis?.sentiment === 'positive' ? '#bbf7d0' : 
                                   textAnalysis?.sentiment === 'negative' ? '#fecaca' : '#e5e7eb'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: textAnalysis?.sentiment === 'positive' ? '#059669' : 
                           textAnalysis?.sentiment === 'negative' ? '#dc2626' : '#6b7280',
                    textTransform: 'capitalize'
                  }}>
                    {textAnalysis?.sentiment} Sentiment
                  </span>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: textAnalysis?.sentiment === 'positive' ? '#059669' : 
                           textAnalysis?.sentiment === 'negative' ? '#dc2626' : '#6b7280'
                  }}>
                    {textAnalysis?.sentimentScore > 0 ? '+' : ''}{textAnalysis?.sentimentScore}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Words */}
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
              Most Frequent Words
            </h5>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {textAnalysis?.topWords?.map((word, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 15px',
                  backgroundColor: index % 2 === 0 ? '#f9fafb' : '#ffffff',
                  borderRadius: '6px',
                  marginBottom: '5px'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    {word.word}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: `${(word.frequency / textAnalysis.topWords[0].frequency) * 100}px`,
                      height: '8px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px'
                    }} />
                    <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '30px' }}>
                      {word.frequency}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* TF-IDF Preview */}
            {tfidf && Object.keys(tfidf).length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                  TF-IDF Analysis
                </h6>
                <div style={{
                  padding: '15px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Documents Analyzed:</strong> {Object.keys(tfidf).length}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Unique Terms:</strong> {Object.keys(Object.values(tfidf)[0] || {}).length}
                  </div>
                  <div>
                    TF-IDF (Term Frequency-Inverse Document Frequency) measures word importance across documents.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default StatisticalModules;