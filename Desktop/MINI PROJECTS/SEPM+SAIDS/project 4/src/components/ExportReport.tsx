import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Download, FileText, Share2 } from 'lucide-react';

const ExportReport: React.FC = () => {
  const { data, columns, fileName, rowCount, columnTypes } = useSelector((state: RootState) => state.dataset);
  const { statistics, insights, correlationMatrix } = useSelector((state: RootState) => state.analysis);

  const generateReport = () => {
    const report = {
      metadata: {
        fileName,
        timestamp: new Date().toISOString(),
        rowCount,
        columnCount: columns.length,
        columnTypes,
      },
      summary: {
        numericColumns: columns.filter(col => columnTypes[col] === 'numeric').length,
        categoricalColumns: columns.filter(col => columnTypes[col] === 'categorical').length,
      },
      statistics,
      insights,
      correlationMatrix,
      sampleData: data.slice(0, 5),
    };

    return report;
  };

  const downloadJSON = () => {
    const report = generateReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eda_report_${fileName.replace('.csv', '')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (data.length === 0) return;

    const csvContent = [
      columns.join(','),
      ...data.slice(0, 1000).map(row => 
        columns.map(col => {
          const value = row[col];
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value === null ? '' : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processed_${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    const report = generateReport();
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      alert('Report copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = JSON.stringify(report, null, 2);
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Report copied to clipboard!');
    }
  };

  if (data.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
        <FileText size={48} style={{ margin: '0 auto 16px' }} />
        <p>No data available for export. Please upload and analyze a CSV file first.</p>
      </div>
    );
  }

  const report = generateReport();

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
        Export Analysis Report
      </h2>

      {/* Report Summary */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Report Summary
        </h3>
        <div style={{ 
          backgroundColor: '#f9fafb', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          padding: '20px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Dataset</p>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>{fileName}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Dimensions</p>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>
                {rowCount.toLocaleString()} rows × {columns.length} columns
              </p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Column Types</p>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>
                {report.summary.numericColumns} numeric, {report.summary.categoricalColumns} categorical
              </p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Generated</p>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights Preview */}
      {insights.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Key Insights ({insights.length} total)
          </h3>
          <div style={{ 
            backgroundColor: '#fffbeb', 
            border: '1px solid #fed7aa', 
            borderRadius: '8px', 
            padding: '16px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {insights.slice(0, 5).map((insight, index) => (
              <p key={index} style={{ margin: '4px 0', fontSize: '14px', color: '#92400e' }}>
                • {insight}
              </p>
            ))}
            {insights.length > 5 && (
              <p style={{ margin: '8px 0 4px', fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                ... and {insights.length - 5} more insights in the full report
              </p>
            )}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Export Options
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {/* JSON Report */}
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: '#fafafa'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Download size={20} color="#3b82f6" />
              <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Complete Analysis (JSON)</h4>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              Download complete statistical analysis, insights, and correlation data as JSON format.
            </p>
            <button
              onClick={downloadJSON}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              Download JSON Report
            </button>
          </div>

          {/* Processed Data */}
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: '#fafafa'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FileText size={20} color="#10b981" />
              <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Processed Data (CSV)</h4>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              Download the cleaned dataset with proper data types (first 1000 rows).
            </p>
            <button
              onClick={downloadCSV}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Download CSV File
            </button>
          </div>

          {/* Copy to Clipboard */}
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: '#fafafa'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Share2 size={20} color="#8b5cf6" />
              <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Copy to Clipboard</h4>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              Copy the complete analysis report to your clipboard for sharing or further use.
            </p>
            <button
              onClick={copyToClipboard}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
            >
              Copy Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Report Preview
        </h3>
        <div style={{ 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '16px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExportReport;