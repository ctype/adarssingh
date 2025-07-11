import Papa from 'papaparse';
import { 
  mean, median, std, min, max, mode, quantileSeq, variance,
  evaluate
} from 'mathjs';
import { scaleLinear } from 'd3-scale';
import { histogram, extent, bin } from 'd3-array';

export interface ProcessedData {
  data: any[];
  columns: string[];
  columnTypes: Record<string, 'numeric' | 'categorical' | 'date' | 'boolean'>;
}

export const parseCSV = (file: File): Promise<ProcessedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // We'll handle type conversion manually
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('CSV parsing failed: ' + results.errors[0].message));
          return;
        }

        const data = results.data as any[];
        if (data.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }

        const columns = Object.keys(data[0] || {});
        if (columns.length === 0) {
          reject(new Error('No columns found in CSV file'));
          return;
        }

        const columnTypes = detectColumnTypes(data, columns);

        // Convert and clean data
        const processedData = data.map(row => {
          const newRow = { ...row };
          Object.keys(columnTypes).forEach(col => {
            const value = newRow[col];
            
            if (value === '' || value === null || value === undefined) {
              newRow[col] = null;
              return;
            }

            switch (columnTypes[col]) {
              case 'numeric':
                const num = parseFloat(value);
                newRow[col] = isNaN(num) ? null : num;
                break;
              case 'boolean':
                newRow[col] = parseBooleanValue(value);
                break;
              case 'date':
                const date = new Date(value);
                newRow[col] = isNaN(date.getTime()) ? null : date;
                break;
              default:
                newRow[col] = String(value).trim();
            }
          });
          return newRow;
        });

        resolve({
          data: processedData,
          columns,
          columnTypes,
        });
      },
      error: (error) => {
        reject(new Error('CSV parsing failed: ' + error.message));
      },
    });
  });
};

export const detectColumnTypes = (data: any[], columns: string[]): Record<string, 'numeric' | 'categorical' | 'date' | 'boolean'> => {
  const types: Record<string, 'numeric' | 'categorical' | 'date' | 'boolean'> = {};
  
  columns.forEach(column => {
    const sample = data.slice(0, Math.min(1000, data.length))
      .map(row => row[column])
      .filter(val => val !== '' && val != null && val !== undefined);
    
    if (sample.length === 0) {
      types[column] = 'categorical';
      return;
    }

    // Check for boolean values
    const booleanCount = sample.filter(val => 
      isBooleanValue(val)
    ).length;
    const booleanRatio = booleanCount / sample.length;

    // Check for numeric values
    const numericCount = sample.filter(val => {
      const num = parseFloat(val);
      return !isNaN(num) && isFinite(num);
    }).length;
    const numericRatio = numericCount / sample.length;

    // Check for date values
    const dateCount = sample.filter(val => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && val.toString().match(/\d{4}|\d{1,2}\/\d{1,2}|\d{1,2}-\d{1,2}/);
    }).length;
    const dateRatio = dateCount / sample.length;

    // Determine type based on ratios
    if (booleanRatio > 0.8) {
      types[column] = 'boolean';
    } else if (numericRatio > 0.8) {
      types[column] = 'numeric';
    } else if (dateRatio > 0.6) {
      types[column] = 'date';
    } else {
      types[column] = 'categorical';
    }
  });

  return types;
};

const isBooleanValue = (value: any): boolean => {
  const str = String(value).toLowerCase().trim();
  return ['true', 'false', '1', '0', 'yes', 'no', 'y', 'n'].includes(str);
};

const parseBooleanValue = (value: any): boolean | null => {
  const str = String(value).toLowerCase().trim();
  if (['true', '1', 'yes', 'y'].includes(str)) return true;
  if (['false', '0', 'no', 'n'].includes(str)) return false;
  return null;
};

export const calculateAdvancedStatistics = (data: any[], columns: string[], columnTypes: Record<string, string>) => {
  const statistics: Record<string, any> = {};

  columns.forEach(column => {
    const allValues = data.map(row => row[column]);
    const validValues = allValues.filter(val => val !== null && val !== undefined);
    const totalCount = data.length;
    const validCount = validValues.length;
    const missingCount = totalCount - validCount;

    if (columnTypes[column] === 'numeric') {
      const numericValues = validValues.filter(val => !isNaN(val) && isFinite(val));
      
      if (numericValues.length > 0) {
        const sortedValues = numericValues.sort((a, b) => a - b);
        const meanVal = mean(numericValues) as number;
        const medianVal = median(sortedValues) as number;
        const stdVal = std(numericValues) as number;
        const varianceVal = variance(numericValues) as number;
        const minVal = min(numericValues) as number;
        const maxVal = max(numericValues) as number;
        const q1 = quantileSeq(sortedValues, 0.25) as number;
        const q3 = quantileSeq(sortedValues, 0.75) as number;
        const iqr = q3 - q1;
        const range = maxVal - minVal;
        
        // Outlier detection using IQR method
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        const outliers = numericValues.filter(val => val < lowerBound || val > upperBound);

        // Skewness calculation
        const skewness = calculateSkewness(numericValues, meanVal, stdVal);
        
        // Kurtosis calculation
        const kurtosis = calculateKurtosis(numericValues, meanVal, stdVal);

        statistics[column] = {
          mean: meanVal,
          median: medianVal,
          std: stdVal,
          variance: varianceVal,
          min: minVal,
          max: maxVal,
          count: validCount,
          missing: missingCount,
          q1,
          q3,
          iqr,
          range,
          outliers: outliers.length,
          skewness,
          kurtosis,
        };
      }
    } else if (columnTypes[column] === 'categorical') {
      const stringValues = validValues.map(val => String(val));
      const uniqueValues = [...new Set(stringValues)];
      const valueCounts: Record<string, number> = {};
      
      stringValues.forEach(val => {
        valueCounts[val] = (valueCounts[val] || 0) + 1;
      });

      const modeValue = Object.entries(valueCounts).reduce((a, b) => 
        valueCounts[a[0]] > valueCounts[b[0]] ? a : b
      )[0];

      statistics[column] = {
        count: validCount,
        missing: missingCount,
        unique: uniqueValues.length,
        mode: modeValue,
        valueCounts,
      };
    } else if (columnTypes[column] === 'date') {
      const dateValues = validValues.filter(val => val instanceof Date && !isNaN(val.getTime()));
      
      if (dateValues.length > 0) {
        const timestamps = dateValues.map(date => date.getTime());
        const minDate = new Date(Math.min(...timestamps));
        const maxDate = new Date(Math.max(...timestamps));
        const range = maxDate.getTime() - minDate.getTime();

        statistics[column] = {
          count: validCount,
          missing: missingCount,
          min: minDate,
          max: maxDate,
          range: range / (1000 * 60 * 60 * 24), // Range in days
        };
      }
    } else if (columnTypes[column] === 'boolean') {
      const booleanValues = validValues.filter(val => typeof val === 'boolean');
      const trueCount = booleanValues.filter(val => val === true).length;
      const falseCount = booleanValues.filter(val => val === false).length;

      statistics[column] = {
        count: validCount,
        missing: missingCount,
        trueCount,
        falseCount,
        trueRatio: trueCount / booleanValues.length,
      };
    }
  });

  return statistics;
};

const calculateSkewness = (values: number[], mean: number, std: number): number => {
  if (std === 0) return 0;
  const n = values.length;
  const sum = values.reduce((acc, val) => acc + Math.pow((val - mean) / std, 3), 0);
  return (n / ((n - 1) * (n - 2))) * sum;
};

const calculateKurtosis = (values: number[], mean: number, std: number): number => {
  if (std === 0) return 0;
  const n = values.length;
  const sum = values.reduce((acc, val) => acc + Math.pow((val - mean) / std, 4), 0);
  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
};

export const calculateCorrelation = (data: any[], numericColumns: string[]) => {
  const matrix: Record<string, Record<string, number>> = {};

  numericColumns.forEach(col1 => {
    matrix[col1] = {};
    numericColumns.forEach(col2 => {
      const pairs = data
        .map(row => [row[col1], row[col2]])
        .filter(([val1, val2]) => 
          val1 !== null && val2 !== null && 
          !isNaN(val1) && !isNaN(val2) &&
          isFinite(val1) && isFinite(val2)
        );
      
      if (pairs.length > 1) {
        const values1 = pairs.map(pair => pair[0]);
        const values2 = pairs.map(pair => pair[1]);
        const correlation = pearsonCorrelation(values1, values2);
        matrix[col1][col2] = correlation;
      } else {
        matrix[col1][col2] = 0;
      }
    });
  });

  return matrix;
};

const pearsonCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  if (n === 0) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};

export const generateAdvancedInsights = (
  statistics: Record<string, any>, 
  correlationMatrix: Record<string, Record<string, number>>,
  columnTypes: Record<string, string>
) => {
  const insights: string[] = [];

  // Missing data insights
  Object.entries(statistics).forEach(([column, stats]) => {
    if (stats.missing > 0) {
      const missingPercent = (stats.missing / (stats.count + stats.missing) * 100).toFixed(1);
      if (parseFloat(missingPercent) > 10) {
        insights.push(`⚠️ ${column} has significant missing data: ${stats.missing} values (${missingPercent}%)`);
      } else {
        insights.push(`📊 ${column} has ${stats.missing} missing values (${missingPercent}%)`);
      }
    }
  });

  // Outlier insights
  Object.entries(statistics).forEach(([column, stats]) => {
    if (stats.outliers > 0) {
      const outlierPercent = (stats.outliers / stats.count * 100).toFixed(1);
      if (parseFloat(outlierPercent) > 5) {
        insights.push(`🔍 ${column} has many outliers: ${stats.outliers} values (${outlierPercent}%) - consider investigation`);
      } else {
        insights.push(`📈 ${column} has ${stats.outliers} outliers detected using IQR method`);
      }
    }
  });

  // Distribution insights
  Object.entries(statistics).forEach(([column, stats]) => {
    if (columnTypes[column] === 'numeric' && stats.skewness !== undefined) {
      if (Math.abs(stats.skewness) > 1) {
        const direction = stats.skewness > 0 ? 'right' : 'left';
        insights.push(`📊 ${column} is highly skewed to the ${direction} (skewness: ${stats.skewness.toFixed(3)})`);
      } else if (Math.abs(stats.skewness) > 0.5) {
        const direction = stats.skewness > 0 ? 'right' : 'left';
        insights.push(`📈 ${column} is moderately skewed to the ${direction} (skewness: ${stats.skewness.toFixed(3)})`);
      }
    }
  });

  // Correlation insights
  Object.entries(correlationMatrix).forEach(([col1, correlations]) => {
    Object.entries(correlations).forEach(([col2, corr]) => {
      if (col1 !== col2 && Math.abs(corr) > 0.7) {
        const strength = Math.abs(corr) > 0.9 ? 'very strong' : 'strong';
        const direction = corr > 0 ? 'positive' : 'negative';
        insights.push(`🔗 ${strength} ${direction} correlation between ${col1} and ${col2} (r=${corr.toFixed(3)})`);
      } else if (col1 !== col2 && Math.abs(corr) > 0.5) {
        const direction = corr > 0 ? 'positive' : 'negative';
        insights.push(`📊 Moderate ${direction} correlation between ${col1} and ${col2} (r=${corr.toFixed(3)})`);
      }
    });
  });

  // Categorical insights
  Object.entries(statistics).forEach(([column, stats]) => {
    if (columnTypes[column] === 'categorical' && stats.unique !== undefined) {
      const uniqueRatio = stats.unique / stats.count;
      if (uniqueRatio > 0.9) {
        insights.push(`🔍 ${column} has very high cardinality: ${stats.unique} unique values (${(uniqueRatio * 100).toFixed(1)}%)`);
      } else if (uniqueRatio < 0.1) {
        insights.push(`📊 ${column} has low cardinality: only ${stats.unique} unique values`);
      }
    }
  });

  return insights;
};

export const createHistogramData = (values: number[], bins: number = 30) => {
  const validValues = values.filter(val => val !== null && !isNaN(val) && isFinite(val));
  if (validValues.length === 0) return [];

  const [minVal, maxVal] = extent(validValues) as [number, number];
  const binGenerator = bin().domain([minVal, maxVal]).thresholds(bins);
  const histogramBins = binGenerator(validValues);

  return histogramBins.map((bin, index) => ({
    range: `${bin.x0?.toFixed(2)}-${bin.x1?.toFixed(2)}`,
    count: bin.length,
    binStart: bin.x0,
    binEnd: bin.x1,
    density: bin.length / validValues.length,
  }));
};

export const createBoxPlotData = (values: number[]) => {
  const validValues = values.filter(val => val !== null && !isNaN(val) && isFinite(val));
  if (validValues.length === 0) return null;

  const sortedValues = validValues.sort((a, b) => a - b);
  const q1 = quantileSeq(sortedValues, 0.25) as number;
  const median = quantileSeq(sortedValues, 0.5) as number;
  const q3 = quantileSeq(sortedValues, 0.75) as number;
  const iqr = q3 - q1;
  const lowerWhisker = Math.max(sortedValues[0], q1 - 1.5 * iqr);
  const upperWhisker = Math.min(sortedValues[sortedValues.length - 1], q3 + 1.5 * iqr);
  
  const outliers = validValues.filter(val => val < lowerWhisker || val > upperWhisker);

  return {
    q1,
    median,
    q3,
    lowerWhisker,
    upperWhisker,
    outliers,
    iqr,
  };
};

// Export the main calculation function with the new name
export const calculateStatistics = calculateAdvancedStatistics;
export const generateInsights = generateAdvancedInsights;