import { 
  mean, median, mode, std, variance, quantileSeq, min, max,
  evaluate, matrix, multiply, transpose, inv
} from 'mathjs';
import * as ss from 'simple-statistics';
import jStat from 'jstat';

// MODULE I: Data & Sampling
export interface DataClassification {
  variableType: 'quantitative' | 'qualitative';
  dataLevel: 'nominal' | 'ordinal' | 'interval' | 'ratio';
  dataSource: 'primary' | 'secondary';
}

export interface FrequencyTable {
  value: any;
  frequency: number;
  relativeFrequency: number;
  cumulativeFrequency: number;
  cumulativeRelativeFrequency: number;
}

export const classifyVariable = (data: any[]): DataClassification => {
  const uniqueValues = [...new Set(data.filter(v => v !== null))];
  const numericValues = data.filter(v => typeof v === 'number' && !isNaN(v));
  
  if (numericValues.length / data.length > 0.8) {
    // Check if it's continuous or discrete
    const hasDecimals = numericValues.some(v => v % 1 !== 0);
    return {
      variableType: 'quantitative',
      dataLevel: hasDecimals ? 'ratio' : 'interval',
      dataSource: 'primary'
    };
  } else {
    // Check if ordinal or nominal
    const isOrderable = uniqueValues.every(v => 
      typeof v === 'string' && /^(low|medium|high|small|large|first|second|third)$/i.test(v)
    );
    return {
      variableType: 'qualitative',
      dataLevel: isOrderable ? 'ordinal' : 'nominal',
      dataSource: 'primary'
    };
  }
};

export const createFrequencyTable = (data: any[]): FrequencyTable[] => {
  const frequencies: Record<string, number> = {};
  const validData = data.filter(v => v !== null && v !== undefined);
  
  validData.forEach(value => {
    const key = String(value);
    frequencies[key] = (frequencies[key] || 0) + 1;
  });

  const total = validData.length;
  let cumulativeFreq = 0;
  let cumulativeRelFreq = 0;

  return Object.entries(frequencies)
    .sort(([a], [b]) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    })
    .map(([value, frequency]) => {
      const relativeFrequency = frequency / total;
      cumulativeFreq += frequency;
      cumulativeRelFreq += relativeFrequency;
      
      return {
        value: isNaN(parseFloat(value)) ? value : parseFloat(value),
        frequency,
        relativeFrequency,
        cumulativeFrequency: cumulativeFreq,
        cumulativeRelativeFrequency: cumulativeRelFreq
      };
    });
};

// MODULE II: Data Summary
export interface DescriptiveStats {
  mean: number;
  median: number;
  mode: number | string;
  q1: number;
  q3: number;
  range: number;
  variance: number;
  standardDeviation: number;
  skewness: number;
  kurtosis: number;
  outliers: number[];
  percentiles: Record<number, number>;
  deciles: Record<number, number>;
}

export const calculateDescriptiveStats = (data: number[]): DescriptiveStats => {
  const validData = data.filter(v => !isNaN(v) && isFinite(v)).sort((a, b) => a - b);
  
  if (validData.length === 0) {
    throw new Error('No valid numeric data provided');
  }

  const meanVal = mean(validData) as number;
  const medianVal = median(validData) as number;
  const modeVal = ss.mode(validData);
  const q1 = quantileSeq(validData, 0.25) as number;
  const q3 = quantileSeq(validData, 0.75) as number;
  const varianceVal = variance(validData) as number;
  const stdVal = std(validData) as number;
  
  // Calculate skewness and kurtosis
  const skewness = ss.sampleSkewness(validData);
  const kurtosis = ss.sampleKurtosis(validData);
  
  // Outlier detection using IQR method
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  const outliers = validData.filter(v => v < lowerBound || v > upperBound);
  
  // Calculate percentiles and deciles
  const percentiles: Record<number, number> = {};
  const deciles: Record<number, number> = {};
  
  for (let i = 1; i <= 99; i++) {
    percentiles[i] = quantileSeq(validData, i / 100) as number;
  }
  
  for (let i = 1; i <= 9; i++) {
    deciles[i] = quantileSeq(validData, i / 10) as number;
  }

  return {
    mean: meanVal,
    median: medianVal,
    mode: modeVal,
    q1,
    q3,
    range: max(validData) as number - min(validData) as number,
    variance: varianceVal,
    standardDeviation: stdVal,
    skewness,
    kurtosis,
    outliers,
    percentiles,
    deciles
  };
};

// MODULE III: Probability & Distributions
export interface DistributionFit {
  distribution: 'normal' | 'binomial' | 'poisson' | 'exponential';
  parameters: Record<string, number>;
  goodnessOfFit: number;
  pValue: number;
}

export const fitDistribution = (data: number[]): DistributionFit[] => {
  const validData = data.filter(v => !isNaN(v) && isFinite(v));
  const results: DistributionFit[] = [];
  
  // Normal distribution
  const meanVal = ss.mean(validData);
  const stdVal = ss.standardDeviation(validData);
  
  results.push({
    distribution: 'normal',
    parameters: { mean: meanVal, std: stdVal },
    goodnessOfFit: calculateKSTest(validData, 'normal', { mean: meanVal, std: stdVal }),
    pValue: 0.05 // Placeholder - would need proper implementation
  });
  
  // Poisson distribution (for count data)
  if (validData.every(v => v >= 0 && v % 1 === 0)) {
    const lambda = ss.mean(validData);
    results.push({
      distribution: 'poisson',
      parameters: { lambda },
      goodnessOfFit: calculateKSTest(validData, 'poisson', { lambda }),
      pValue: 0.05
    });
  }
  
  return results;
};

const calculateKSTest = (data: number[], distribution: string, params: any): number => {
  // Simplified KS test implementation
  // In a real implementation, you'd use a proper statistical library
  return Math.random(); // Placeholder
};

// MODULE IV: Hypothesis Testing
export interface HypothesisTest {
  testType: 'one-sample-t' | 'two-sample-t' | 'paired-t' | 'z-test' | 'chi-square';
  nullHypothesis: string;
  alternativeHypothesis: string;
  testStatistic: number;
  pValue: number;
  criticalValue: number;
  conclusion: string;
  effectSize?: number;
}

export const performTTest = (
  data1: number[], 
  data2?: number[], 
  mu0: number = 0, 
  alpha: number = 0.05,
  testType: 'one-sample' | 'two-sample' | 'paired' = 'one-sample'
): HypothesisTest => {
  
  if (testType === 'one-sample') {
    const n = data1.length;
    const meanVal = ss.mean(data1);
    const stdVal = ss.standardDeviation(data1);
    const tStat = (meanVal - mu0) / (stdVal / Math.sqrt(n));
    const df = n - 1;
    const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStat), df));
    const criticalValue = jStat.studentt.inv(1 - alpha/2, df);
    
    return {
      testType: 'one-sample-t',
      nullHypothesis: `μ = ${mu0}`,
      alternativeHypothesis: `μ ≠ ${mu0}`,
      testStatistic: tStat,
      pValue,
      criticalValue,
      conclusion: pValue < alpha ? 'Reject null hypothesis' : 'Fail to reject null hypothesis'
    };
  }
  
  // Two-sample t-test implementation would go here
  throw new Error('Two-sample t-test not implemented yet');
};

// MODULE V: ANOVA
export interface ANOVAResult {
  fStatistic: number;
  pValue: number;
  dfBetween: number;
  dfWithin: number;
  msBetween: number;
  msWithin: number;
  conclusion: string;
  postHoc?: TukeyHSDResult[];
}

export interface TukeyHSDResult {
  group1: string;
  group2: string;
  meanDifference: number;
  pValue: number;
  significant: boolean;
}

export const performOneWayANOVA = (groups: Record<string, number[]>, alpha: number = 0.05): ANOVAResult => {
  const groupNames = Object.keys(groups);
  const groupData = Object.values(groups);
  const allData = groupData.flat();
  
  const grandMean = ss.mean(allData);
  const n = allData.length;
  const k = groupNames.length;
  
  // Calculate sum of squares
  let ssBetween = 0;
  let ssWithin = 0;
  
  groupData.forEach(group => {
    const groupMean = ss.mean(group);
    const groupSize = group.length;
    
    // Between groups sum of squares
    ssBetween += groupSize * Math.pow(groupMean - grandMean, 2);
    
    // Within groups sum of squares
    group.forEach(value => {
      ssWithin += Math.pow(value - groupMean, 2);
    });
  });
  
  const dfBetween = k - 1;
  const dfWithin = n - k;
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  const fStatistic = msBetween / msWithin;
  const pValue = 1 - jStat.centralF.cdf(fStatistic, dfBetween, dfWithin);
  
  return {
    fStatistic,
    pValue,
    dfBetween,
    dfWithin,
    msBetween,
    msWithin,
    conclusion: pValue < alpha ? 'Reject null hypothesis - groups have different means' : 'Fail to reject null hypothesis'
  };
};

// MODULE VI: Correlation & Regression
export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  correlation: number;
  pValue: number;
  standardError: number;
  residuals: number[];
  predictions: number[];
  confidenceIntervals: Array<{x: number, lower: number, upper: number}>;
}

export const performLinearRegression = (x: number[], y: number[]): RegressionResult => {
  if (x.length !== y.length) {
    throw new Error('X and Y arrays must have the same length');
  }
  
  const n = x.length;
  const sumX = ss.sum(x);
  const sumY = ss.sum(y);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = ss.sum(x.map(xi => xi * xi));
  const sumY2 = ss.sum(y.map(yi => yi * yi));
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const predictions = x.map(xi => slope * xi + intercept);
  const residuals = y.map((yi, i) => yi - predictions[i]);
  
  const ssRes = ss.sum(residuals.map(r => r * r));
  const ssTot = ss.sum(y.map(yi => Math.pow(yi - ss.mean(y), 2)));
  const rSquared = 1 - (ssRes / ssTot);
  
  const correlation = ss.sampleCorrelation(x, y);
  
  // Calculate standard error and confidence intervals
  const standardError = Math.sqrt(ssRes / (n - 2));
  const confidenceIntervals = x.map(xi => {
    const prediction = slope * xi + intercept;
    const margin = 1.96 * standardError; // 95% CI approximation
    return {
      x: xi,
      lower: prediction - margin,
      upper: prediction + margin
    };
  });
  
  return {
    slope,
    intercept,
    rSquared,
    correlation,
    pValue: 0.05, // Placeholder
    standardError,
    residuals,
    predictions,
    confidenceIntervals
  };
};

export const performMultipleRegression = (X: number[][], y: number[]): any => {
  // Multiple regression implementation using matrix operations
  // This would require a more sophisticated implementation
  throw new Error('Multiple regression not implemented yet');
};

// Time Series Analysis
export interface TimeSeriesDecomposition {
  trend: number[];
  seasonal: number[];
  residual: number[];
  originalData: number[];
}

export const decomposeTimeSeries = (data: number[], period: number = 12): TimeSeriesDecomposition => {
  // Simple moving average for trend
  const trend = [];
  const halfPeriod = Math.floor(period / 2);
  
  for (let i = 0; i < data.length; i++) {
    if (i < halfPeriod || i >= data.length - halfPeriod) {
      trend.push(NaN);
    } else {
      const start = i - halfPeriod;
      const end = i + halfPeriod + 1;
      const subset = data.slice(start, end);
      trend.push(ss.mean(subset));
    }
  }
  
  // Calculate seasonal component
  const seasonal = new Array(data.length).fill(0);
  const residual = data.map((value, i) => {
    if (isNaN(trend[i])) return NaN;
    return value - trend[i] - seasonal[i];
  });
  
  return {
    trend,
    seasonal,
    residual,
    originalData: data
  };
};

// Text Analytics
export interface TextAnalysisResult {
  wordCount: number;
  uniqueWords: number;
  averageWordLength: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  topWords: Array<{word: string, frequency: number}>;
  readabilityScore: number;
}

export const analyzeText = (text: string): TextAnalysisResult => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  const topWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word, frequency]) => ({ word, frequency }));
  
  // Simple sentiment analysis (would use a proper library in production)
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing', 'poor'];
  
  let sentimentScore = 0;
  words.forEach(word => {
    if (positiveWords.includes(word)) sentimentScore++;
    if (negativeWords.includes(word)) sentimentScore--;
  });
  
  const sentiment = sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral';
  
  return {
    wordCount: words.length,
    uniqueWords: Object.keys(wordFreq).length,
    averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length,
    sentiment,
    sentimentScore,
    topWords,
    readabilityScore: Math.max(0, Math.min(100, 100 - words.length / 10)) // Simplified
  };
};

export const createTfIdfMatrix = (documents: string[]): Record<string, Record<string, number>> => {
  // TF-IDF implementation
  const allWords = new Set<string>();
  const docWords = documents.map(doc => {
    const words = doc.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
    words.forEach(word => allWords.add(word));
    return words;
  });
  
  const tfidf: Record<string, Record<string, number>> = {};
  
  documents.forEach((doc, docIndex) => {
    tfidf[`doc_${docIndex}`] = {};
    const words = docWords[docIndex];
    const wordCount = words.length;
    
    allWords.forEach(word => {
      const tf = words.filter(w => w === word).length / wordCount;
      const df = docWords.filter(docWordList => docWordList.includes(word)).length;
      const idf = Math.log(documents.length / df);
      tfidf[`doc_${docIndex}`][word] = tf * idf;
    });
  });
  
  return tfidf;
};