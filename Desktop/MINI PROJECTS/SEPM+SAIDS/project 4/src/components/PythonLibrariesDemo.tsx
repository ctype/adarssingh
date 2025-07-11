import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Plot from 'react-plotly.js';
import {
  Code, Database, BarChart3, Zap, Brain, TrendingUp,
  LineChart, PieChart, Activity, Target, Grid3X3
} from 'lucide-react';

const PythonLibrariesDemo: React.FC = () => {
  const { data, columns, columnTypes } = useSelector((state: RootState) => state.dataset);
  const [activeDemo, setActiveDemo] = useState('pandas');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [plotData, setPlotData] = useState<any>(null);

  const libraries = [
    { id: 'pandas', name: 'Pandas Operations', icon: Database, color: '#150458' },
    { id: 'numpy', name: 'NumPy Arrays', icon: Grid3X3, color: '#013243' },
    { id: 'matplotlib', name: 'Matplotlib Plots', icon: BarChart3, color: '#11557c' },
    { id: 'seaborn', name: 'Seaborn Visualizations', icon: Activity, color: '#4c72b0' },
    { id: 'sklearn', name: 'Scikit-learn ML', icon: Brain, color: '#f7931e' },
    { id: 'plotly', name: 'Interactive Plotly', icon: LineChart, color: '#3f83f8' }
  ];

  useEffect(() => {
    if (data.length > 0 && selectedColumns.length > 0) {
      generateDemoContent();
    }
  }, [activeDemo, selectedColumns, data]);

  const generateDemoContent = () => {
    const numericColumns = columns.filter(col => columnTypes[col] === 'numeric');
    const categoricalColumns = columns.filter(col => columnTypes[col] === 'categorical');

    switch (activeDemo) {
      case 'matplotlib':
        generateMatplotlibDemo(numericColumns);
        break;
      case 'seaborn':
        generateSeabornDemo(numericColumns, categoricalColumns);
        break;
      case 'plotly':
        generatePlotlyDemo(numericColumns);
        break;
      default:
        setPlotData(null);
    }
  };

  const generateMatplotlibDemo = (numericColumns: string[]) => {
    if (numericColumns.length === 0) return;

    const column = numericColumns[0];
    const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
    
    // Create histogram data
    const bins = 20;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const histData = [];
    for (let i = 0; i < bins; i++) {
      const binStart = min + i * binWidth;
      const binEnd = min + (i + 1) * binWidth;
      const count = values.filter(val => val >= binStart && val < binEnd).length;
      histData.push({
        x: binStart + binWidth / 2,
        y: count,
        binStart,
        binEnd
      });
    }

    setPlotData({
      type: 'matplotlib',
      data: [{
        x: histData.map(d => d.x),
        y: histData.map(d => d.y),
        type: 'bar',
        name: 'Frequency',
        marker: { color: '#1f77b4' }
      }],
      layout: {
        title: `Matplotlib-style Histogram: ${column}`,
        xaxis: { title: column },
        yaxis: { title: 'Frequency' },
        showlegend: false
      }
    });
  };

  const generateSeabornDemo = (numericColumns: string[], categoricalColumns: string[]) => {
    if (numericColumns.length < 2) return;

    const xCol = numericColumns[0];
    const yCol = numericColumns[1];
    const colorCol = categoricalColumns[0];

    const scatterData = data
      .filter(row => !isNaN(parseFloat(row[xCol])) && !isNaN(parseFloat(row[yCol])))
      .map(row => ({
        x: parseFloat(row[xCol]),
        y: parseFloat(row[yCol]),
        color: colorCol ? row[colorCol] : 'default'
      }));

    const uniqueColors = [...new Set(scatterData.map(d => d.color))];
    const traces = uniqueColors.map((color, index) => ({
      x: scatterData.filter(d => d.color === color).map(d => d.x),
      y: scatterData.filter(d => d.color === color).map(d => d.y),
      mode: 'markers',
      type: 'scatter',
      name: color,
      marker: {
        color: `hsl(${index * 360 / uniqueColors.length}, 70%, 50%)`,
        size: 8
      }
    }));

    setPlotData({
      type: 'seaborn',
      data: traces,
      layout: {
        title: `Seaborn-style Scatter Plot: ${xCol} vs ${yCol}`,
        xaxis: { title: xCol },
        yaxis: { title: yCol }
      }
    });
  };

  const generatePlotlyDemo = (numericColumns: string[]) => {
    if (numericColumns.length < 3) return;

    const xCol = numericColumns[0];
    const yCol = numericColumns[1];
    const zCol = numericColumns[2];

    const scatter3dData = data
      .filter(row => 
        !isNaN(parseFloat(row[xCol])) && 
        !isNaN(parseFloat(row[yCol])) && 
        !isNaN(parseFloat(row[zCol]))
      )
      .slice(0, 500) // Limit for performance
      .map(row => ({
        x: parseFloat(row[xCol]),
        y: parseFloat(row[yCol]),
        z: parseFloat(row[zCol])
      }));

    setPlotData({
      type: 'plotly',
      data: [{
        x: scatter3dData.map(d => d.x),
        y: scatter3dData.map(d => d.y),
        z: scatter3dData.map(d => d.z),
        mode: 'markers',
        type: 'scatter3d',
        marker: {
          size: 5,
          color: scatter3dData.map(d => d.z),
          colorscale: 'Viridis',
          showscale: true
        }
      }],
      layout: {
        title: `Interactive 3D Scatter: ${xCol}, ${yCol}, ${zCol}`,
        scene: {
          xaxis: { title: xCol },
          yaxis: { title: yCol },
          zaxis: { title: zCol }
        }
      }
    });
  };

  const generateCodeExample = () => {
    switch (activeDemo) {
      case 'pandas':
        return `# Pandas DataFrame Operations
import pandas as pd

# Load data
df = pd.read_csv('data.csv')

# Basic operations
print(df.head())
print(df.describe())
print(df.info())

# Data cleaning
df_clean = df.dropna()
df_clean = df_clean.drop_duplicates()

# Grouping and aggregation
grouped = df.groupby('category').agg({
    'numeric_col': ['mean', 'std', 'count']
})

# Filtering
filtered = df[df['numeric_col'] > df['numeric_col'].mean()]

# Creating new columns
df['new_col'] = df['col1'] * df['col2']
df['category_encoded'] = pd.Categorical(df['category']).codes`;

      case 'numpy':
        return `# NumPy Array Operations
import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.random.rand(5, 5)

# Mathematical operations
mean_val = np.mean(arr)
std_val = np.std(arr)
correlation = np.corrcoef(matrix)

# Array manipulation
reshaped = arr.reshape(-1, 1)
normalized = (arr - np.mean(arr)) / np.std(arr)

# Linear algebra
eigenvals, eigenvecs = np.linalg.eig(matrix)
inverse = np.linalg.inv(matrix)

# Statistical functions
percentiles = np.percentile(arr, [25, 50, 75])
histogram = np.histogram(arr, bins=10)`;

      case 'matplotlib':
        return `# Matplotlib Plotting
import matplotlib.pyplot as plt
import numpy as np

# Basic plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, label='Line Plot')
plt.scatter(x, y, alpha=0.6)
plt.xlabel('X Label')
plt.ylabel('Y Label')
plt.title('Matplotlib Plot')
plt.legend()
plt.grid(True)

# Subplots
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
axes[0,0].hist(data, bins=20)
axes[0,1].boxplot(data)
axes[1,0].scatter(x, y)
axes[1,1].plot(x, np.cumsum(y))

# Customization
plt.style.use('seaborn')
plt.rcParams['figure.dpi'] = 300
plt.tight_layout()
plt.show()`;

      case 'seaborn':
        return `# Seaborn Statistical Visualizations
import seaborn as sns
import matplotlib.pyplot as plt

# Set style
sns.set_style("whitegrid")
sns.set_palette("husl")

# Distribution plots
sns.histplot(data=df, x='numeric_col', hue='category')
sns.boxplot(data=df, x='category', y='numeric_col')
sns.violinplot(data=df, x='category', y='numeric_col')

# Relationship plots
sns.scatterplot(data=df, x='col1', y='col2', hue='category')
sns.pairplot(df, hue='category')
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')

# Regression plots
sns.regplot(data=df, x='col1', y='col2')
sns.lmplot(data=df, x='col1', y='col2', hue='category')

# Categorical plots
sns.countplot(data=df, x='category')
sns.barplot(data=df, x='category', y='numeric_col')`;

      case 'sklearn':
        return `# Scikit-learn Machine Learning
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, r2_score
from sklearn.preprocessing import StandardScaler

# Data preparation
X = df[['feature1', 'feature2', 'feature3']]
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Preprocessing
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Regression
reg_model = LinearRegression()
reg_model.fit(X_train_scaled, y_train)
y_pred = reg_model.predict(X_test_scaled)
r2 = r2_score(y_test, y_pred)

# Classification
clf_model = RandomForestClassifier(n_estimators=100)
clf_model.fit(X_train, y_train)
y_pred_clf = clf_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred_clf)`;

      case 'plotly':
        return `# Interactive Plotly Visualizations
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

# Basic interactive plot
fig = px.scatter(df, x='col1', y='col2', color='category',
                size='size_col', hover_data=['extra_info'])
fig.show()

# 3D scatter plot
fig_3d = px.scatter_3d(df, x='x', y='y', z='z', color='category')
fig_3d.show()

# Subplots with different chart types
fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=['Scatter', 'Bar', 'Histogram', 'Box'],
    specs=[[{"type": "scatter"}, {"type": "bar"}],
           [{"type": "histogram"}, {"type": "box"}]]
)

# Add traces
fig.add_trace(go.Scatter(x=x, y=y), row=1, col=1)
fig.add_trace(go.Bar(x=categories, y=values), row=1, col=2)
fig.add_trace(go.Histogram(x=data), row=2, col=1)
fig.add_trace(go.Box(y=data), row=2, col=2)

fig.update_layout(height=600, showlegend=False)
fig.show()`;

      default:
        return '# Select a library to see code examples';
    }
  };

  if (data.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
        <Code size={64} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
        <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Python Libraries Demo</h3>
        <p>Upload a dataset to explore Python data science libraries</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>
        Python Data Science Libraries
      </h2>

      {/* Library Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {libraries.map(library => {
          const Icon = library.icon;
          const isActive = activeDemo === library.id;
          return (
            <button
              key={library.id}
              onClick={() => setActiveDemo(library.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px',
                border: `2px solid ${isActive ? library.color : '#e5e7eb'}`,
                borderRadius: '10px',
                backgroundColor: isActive ? `${library.color}10` : '#ffffff',
                color: isActive ? library.color : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                fontWeight: '600'
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = library.color;
                  e.currentTarget.style.backgroundColor = `${library.color}05`;
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
              {library.name}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Code Example */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>
            {libraries.find(lib => lib.id === activeDemo)?.name} Code
          </h3>
          <div style={{
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '10px',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            fontSize: '12px',
            lineHeight: '1.5',
            overflow: 'auto',
            maxHeight: '500px'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {generateCodeExample()}
            </pre>
          </div>
        </div>

        {/* Visualization/Output */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>
            Interactive Visualization
          </h3>
          
          {['matplotlib', 'seaborn', 'plotly'].includes(activeDemo) ? (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '20px',
              minHeight: '400px'
            }}>
              {plotData ? (
                <Plot
                  data={plotData.data}
                  layout={{
                    ...plotData.layout,
                    autosize: true,
                    margin: { l: 50, r: 50, t: 50, b: 50 }
                  }}
                  style={{ width: '100%', height: '400px' }}
                  config={{ responsive: true }}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '400px',
                  color: '#6b7280'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <Zap size={48} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
                    <p>Select numeric columns to generate visualization</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '30px',
              minHeight: '400px'
            }}>
              {renderLibraryDemo()}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function renderLibraryDemo() {
    const numericColumns = columns.filter(col => columnTypes[col] === 'numeric');
    const categoricalColumns = columns.filter(col => columnTypes[col] === 'categorical');

    switch (activeDemo) {
      case 'pandas':
        return (
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              DataFrame Operations
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                <strong>Shape:</strong> ({data.length}, {columns.length})
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                <strong>Columns:</strong> {columns.join(', ')}
              </div>
              <div style={{ padding: '15px', backgroundColor: '#fefce8', borderRadius: '8px' }}>
                <strong>Data Types:</strong>
                <div style={{ marginTop: '8px', fontSize: '14px' }}>
                  {Object.entries(columnTypes).map(([col, type]) => (
                    <div key={col}>• {col}: {type}</div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                <strong>Memory Usage:</strong> ~{Math.round(data.length * columns.length * 8 / 1024)} KB
              </div>
            </div>
          </div>
        );

      case 'numpy':
        return (
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Array Operations
            </h4>
            {numericColumns.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {numericColumns.slice(0, 3).map(col => {
                  const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
                  const mean = values.reduce((a, b) => a + b, 0) / values.length;
                  const std = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
                  
                  return (
                    <div key={col} style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <strong>{col} Array:</strong>
                      <div style={{ marginTop: '8px', fontSize: '14px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        <div>Mean: {mean.toFixed(3)}</div>
                        <div>Std: {std.toFixed(3)}</div>
                        <div>Shape: ({values.length},)</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: '#6b7280' }}>No numeric columns available for NumPy operations</p>
            )}
          </div>
        );

      case 'sklearn':
        return (
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Machine Learning Pipeline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                <strong>Features Available:</strong> {numericColumns.length} numeric, {categoricalColumns.length} categorical
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                <strong>Preprocessing:</strong>
                <div style={{ marginTop: '8px', fontSize: '14px' }}>
                  • StandardScaler for numeric features<br/>
                  • LabelEncoder for categorical features<br/>
                  • Train/Test split (80/20)
                </div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#fefce8', borderRadius: '8px' }}>
                <strong>Models Available:</strong>
                <div style={{ marginTop: '8px', fontSize: '14px' }}>
                  • Linear/Logistic Regression<br/>
                  • Random Forest<br/>
                  • SVM<br/>
                  • K-Means Clustering
                </div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                <strong>Evaluation Metrics:</strong>
                <div style={{ marginTop: '8px', fontSize: '14px' }}>
                  • R² Score, RMSE (Regression)<br/>
                  • Accuracy, F1-Score (Classification)<br/>
                  • Silhouette Score (Clustering)
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a library to see its demonstration</div>;
    }
  }
};

export default PythonLibrariesDemo;