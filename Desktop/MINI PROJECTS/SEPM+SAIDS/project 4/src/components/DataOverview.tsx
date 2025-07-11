import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Database, FileText, Hash } from 'lucide-react';

const DataOverview: React.FC = () => {
  const { data, columns, fileName, rowCount, columnTypes } = useSelector((state: RootState) => state.dataset);

  if (data.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
        <Database size={48} style={{ margin: '0 auto 16px' }} />
        <p>No data loaded. Please upload a CSV file first.</p>
      </div>
    );
  }

  const sampleData = data.slice(0, 10);
  const numericColumns = Object.entries(columnTypes).filter(([_, type]) => type === 'numeric').length;
  const categoricalColumns = Object.entries(columnTypes).filter(([_, type]) => type === 'categorical').length;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
        Data Overview
      </h2>

      {/* Dataset Info */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          padding: '16px', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FileText size={20} color="#3b82f6" />
            <span style={{ fontWeight: '600' }}>File Name</span>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>{fileName}</p>
        </div>

        <div style={{ 
          padding: '16px', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Hash size={20} color="#10b981" />
            <span style={{ fontWeight: '600' }}>Dimensions</span>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            {rowCount.toLocaleString()} rows × {columns.length} columns
          </p>
        </div>

        <div style={{ 
          padding: '16px', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Database size={20} color="#8b5cf6" />
            <span style={{ fontWeight: '600' }}>Column Types</span>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            {numericColumns} numeric, {categoricalColumns} categorical
          </p>
        </div>
      </div>

      {/* Column Types */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
          Column Information
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '8px'
        }}>
          {columns.map(column => (
            <div 
              key={column}
              style={{ 
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{column}</span>
              <span 
                style={{ 
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: columnTypes[column] === 'numeric' ? '#dbeafe' : '#f3e8ff',
                  color: columnTypes[column] === 'numeric' ? '#1d4ed8' : '#7c3aed'
                }}
              >
                {columnTypes[column]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Data */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
          Sample Data (First 10 rows)
        </h3>
        <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                {columns.map(column => (
                  <th 
                    key={column}
                    style={{ 
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '1px solid #e5e7eb',
                      fontSize: '14px',
                      fontWeight: '600',
                      minWidth: '120px'
                    }}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {columns.map(column => (
                    <td 
                      key={column}
                      style={{ 
                        padding: '12px',
                        fontSize: '14px',
                        color: row[column] === null ? '#9ca3af' : '#111827'
                      }}
                    >
                      {row[column] === null ? 'null' : String(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataOverview;