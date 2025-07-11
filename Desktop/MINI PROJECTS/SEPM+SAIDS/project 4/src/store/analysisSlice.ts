import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StatisticsData {
  mean?: number;
  median?: number;
  std?: number;
  min?: number;
  max?: number;
  count: number;
  missing: number;
  unique?: number;
  mode?: string | number;
  q1?: number;
  q3?: number;
  outliers?: number;
  skewness?: number;
  kurtosis?: number;
  variance?: number;
  range?: number;
  iqr?: number;
}

export interface ChartData {
  type: 'histogram' | 'bar' | 'scatter' | 'correlation' | 'boxplot' | 'heatmap' | 'line' | 'pie' | 'violin';
  column: string;
  data: any[];
  title: string;
  xAxis?: string;
  yAxis?: string;
  description?: string;
}

export interface AnalysisState {
  statistics: Record<string, StatisticsData>;
  insights: string[];
  charts: ChartData[];
  loading: boolean;
  correlationMatrix: Record<string, Record<string, number>>;
  distributionAnalysis: Record<string, {
    normality: number;
    distribution: string;
    parameters: any;
  }>;
  missingValueAnalysis: {
    totalMissing: number;
    missingByColumn: Record<string, number>;
    missingPatterns: any[];
  };
}

const initialState: AnalysisState = {
  statistics: {},
  insights: [],
  charts: [],
  loading: false,
  correlationMatrix: {},
  distributionAnalysis: {},
  missingValueAnalysis: {
    totalMissing: 0,
    missingByColumn: {},
    missingPatterns: [],
  },
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setStatistics: (state, action: PayloadAction<Record<string, StatisticsData>>) => {
      state.statistics = action.payload;
    },
    setInsights: (state, action: PayloadAction<string[]>) => {
      state.insights = action.payload;
    },
    setCharts: (state, action: PayloadAction<ChartData[]>) => {
      state.charts = action.payload;
    },
    addChart: (state, action: PayloadAction<ChartData>) => {
      state.charts.push(action.payload);
    },
    setCorrelationMatrix: (state, action: PayloadAction<Record<string, Record<string, number>>>) => {
      state.correlationMatrix = action.payload;
    },
    setDistributionAnalysis: (state, action: PayloadAction<Record<string, any>>) => {
      state.distributionAnalysis = action.payload;
    },
    setMissingValueAnalysis: (state, action: PayloadAction<AnalysisState['missingValueAnalysis']>) => {
      state.missingValueAnalysis = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearAnalysis: (state) => {
      state.statistics = {};
      state.insights = [];
      state.charts = [];
      state.correlationMatrix = {};
      state.distributionAnalysis = {};
      state.missingValueAnalysis = {
        totalMissing: 0,
        missingByColumn: {},
        missingPatterns: [],
      };
    },
  },
});

export const {
  setStatistics,
  setInsights,
  setCharts,
  addChart,
  setCorrelationMatrix,
  setDistributionAnalysis,
  setMissingValueAnalysis,
  setLoading,
  clearAnalysis,
} = analysisSlice.actions;

export default analysisSlice.reducer;