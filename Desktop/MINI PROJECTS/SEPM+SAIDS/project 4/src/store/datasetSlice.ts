import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { uploadFileToStorage, saveAnalysisResults, saveDatasetToStorage } from '../services/storageService';

export interface DatasetState {
  data: any[];
  columns: string[];
  fileName: string;
  loading: boolean;
  error: string | null;
  rowCount: number;
  columnTypes: Record<string, 'numeric' | 'categorical' | 'date' | 'boolean'>;
  uploadId: string | null;
  fileSize: number;
  uploadedAt: string | null; // Changed from Date | null to string | null
}

const initialState: DatasetState = {
  data: [],
  columns: [],
  fileName: '',
  loading: false,
  error: null,
  rowCount: 0,
  columnTypes: {},
  uploadId: null,
  fileSize: 0,
  uploadedAt: null,
};

// Storage upload thunk
export const uploadDataset = createAsyncThunk(
  'dataset/upload',
  async (file: File) => {
    const result = await uploadFileToStorage(file);
    return {
      ...result,
      fileSize: file.size,
    };
  }
);

// Save dataset data to storage
export const saveDataset = createAsyncThunk(
  'dataset/saveData',
  async (payload: {
    uploadId: string;
    fileName: string;
    fileSize: number;
    data: any[];
    columns: string[];
    columnTypes: Record<string, string>;
  }) => {
    saveDatasetToStorage(
      payload.uploadId,
      payload.fileName,
      payload.fileSize,
      payload.data,
      payload.columns,
      payload.columnTypes
    );
    return payload.uploadId;
  }
);

// Save analysis results to storage
export const saveAnalysis = createAsyncThunk(
  'dataset/saveAnalysis',
  async (payload: {
    uploadId: string;
    statistics: any;
    insights: string[];
    correlationMatrix: any;
    charts: any[];
  }) => {
    await saveAnalysisResults(payload.uploadId, {
      statistics: payload.statistics,
      insights: payload.insights,
      correlationMatrix: payload.correlationMatrix,
      charts: payload.charts,
    });
    return payload.uploadId;
  }
);

const datasetSlice = createSlice({
  name: 'dataset',
  initialState,
  reducers: {
    setDataset: (state, action: PayloadAction<{
      data: any[];
      columns: string[];
      columnTypes: Record<string, 'numeric' | 'categorical' | 'date' | 'boolean'>;
    }>) => {
      state.data = action.payload.data;
      state.columns = action.payload.columns;
      state.columnTypes = action.payload.columnTypes;
      state.rowCount = action.payload.data.length;
      state.error = null;
    },
    clearDataset: (state) => {
      state.data = [];
      state.columns = [];
      state.fileName = '';
      state.rowCount = 0;
      state.columnTypes = {};
      state.error = null;
      state.uploadId = null;
      state.fileSize = 0;
      state.uploadedAt = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDataset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDataset.fulfilled, (state, action) => {
        state.loading = false;
        state.fileName = action.payload.fileName;
        state.uploadId = action.payload.uploadId;
        state.fileSize = action.payload.fileSize;
        state.uploadedAt = action.payload.timestamp; // Now a string instead of Date
      })
      .addCase(uploadDataset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Upload failed';
      })
      .addCase(saveDataset.fulfilled, (state) => {
        // Dataset saved successfully
      })
      .addCase(saveDataset.rejected, (state, action) => {
        console.warn('Failed to save dataset:', action.error.message);
      })
      .addCase(saveAnalysis.fulfilled, (state) => {
        // Analysis saved successfully
      })
      .addCase(saveAnalysis.rejected, (state, action) => {
        console.warn('Failed to save analysis:', action.error.message);
      });
  },
});

export const { setDataset, clearDataset, setError, clearError } = datasetSlice.actions;
export default datasetSlice.reducer;