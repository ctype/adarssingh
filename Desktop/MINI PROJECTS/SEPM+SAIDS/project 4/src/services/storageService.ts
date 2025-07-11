export interface UploadResult {
  uploadId: string;
  fileName: string;
  timestamp: string; // Changed from Date to string
}

export interface DatasetMetadata {
  id: string;
  fileName: string;
  uploadId: string;
  rowCount: number;
  columnCount: number;
  fileSize: number;
  uploadedAt: Date;
}

export interface StoredDataset {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  data: any[];
  columns: string[];
  columnTypes: Record<string, string>;
  rowCount: number;
  columnCount: number;
  sessionId: string; // Add session tracking
}

export interface AnalysisResults {
  statistics: any;
  insights: string[];
  correlationMatrix: any;
  charts: any[];
}

const STORAGE_KEYS = {
  DATASETS: 'eda_datasets',
  CURRENT_DATASET: 'eda_current_dataset',
  ANALYSIS_RESULTS: 'eda_analysis_results',
  SESSION_ID: 'eda_session_id',
  CLEANUP_TIMESTAMP: 'eda_cleanup_timestamp',
};

// Generate unique session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  }
  return sessionId;
};

// Simulate file upload with delay
export const uploadFileToStorage = async (file: File): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    // Simulate upload delay
    setTimeout(() => {
      try {
        const uploadId = generateId();
        const timestamp = new Date().toISOString(); // Return ISO string instead of Date object

        resolve({
          uploadId,
          fileName: file.name,
          timestamp,
        });
      } catch (error) {
        reject(new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    }, 1500); // 1.5 second delay to simulate upload
  });
};

export const saveDatasetToStorage = (
  uploadId: string,
  fileName: string,
  fileSize: number,
  data: any[],
  columns: string[],
  columnTypes: Record<string, string>
): void => {
  try {
    const sessionId = getSessionId();
    const dataset: StoredDataset = {
      id: uploadId,
      fileName,
      fileSize,
      uploadedAt: new Date().toISOString(),
      data,
      columns,
      columnTypes,
      rowCount: data.length,
      columnCount: columns.length,
      sessionId, // Track which session created this dataset
    };

    // Save to localStorage
    const datasets = getStoredDatasets();
    datasets[uploadId] = dataset;
    localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));

    // Set as current dataset
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_DATASET, uploadId);
    
    // Update cleanup timestamp
    localStorage.setItem(STORAGE_KEYS.CLEANUP_TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error('Error saving dataset to storage:', error);
    throw new Error('Failed to save dataset');
  }
};

export const saveAnalysisResults = async (
  uploadId: string,
  analysisData: AnalysisResults
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const analysisKey = `${STORAGE_KEYS.ANALYSIS_RESULTS}_${uploadId}`;
      const analysisWithSession = {
        ...analysisData,
        sessionId: getSessionId(),
        timestamp: Date.now(),
      };
      localStorage.setItem(analysisKey, JSON.stringify(analysisWithSession));
      resolve();
    } catch (error) {
      console.error('Error saving analysis results:', error);
      reject(new Error('Failed to save analysis results'));
    }
  });
};

export const getDatasetMetadata = async (uploadId: string): Promise<DatasetMetadata | null> => {
  try {
    const datasets = getStoredDatasets();
    const dataset = datasets[uploadId];
    
    if (dataset) {
      return {
        id: dataset.id,
        fileName: dataset.fileName,
        uploadId: dataset.id,
        rowCount: dataset.rowCount,
        columnCount: dataset.columnCount,
        fileSize: dataset.fileSize,
        uploadedAt: new Date(dataset.uploadedAt),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting dataset metadata:', error);
    return null;
  }
};

export const getStoredDataset = (uploadId: string): StoredDataset | null => {
  try {
    const datasets = getStoredDatasets();
    return datasets[uploadId] || null;
  } catch (error) {
    console.error('Error getting stored dataset:', error);
    return null;
  }
};

export const getCurrentDatasetId = (): string | null => {
  return sessionStorage.getItem(STORAGE_KEYS.CURRENT_DATASET);
};

export const getAnalysisResults = (uploadId: string): AnalysisResults | null => {
  try {
    const analysisKey = `${STORAGE_KEYS.ANALYSIS_RESULTS}_${uploadId}`;
    const stored = localStorage.getItem(analysisKey);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting analysis results:', error);
    return null;
  }
};

export const deleteDataset = async (uploadId: string): Promise<void> => {
  try {
    // Remove from datasets
    const datasets = getStoredDatasets();
    delete datasets[uploadId];
    localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));

    // Remove analysis results
    const analysisKey = `${STORAGE_KEYS.ANALYSIS_RESULTS}_${uploadId}`;
    localStorage.removeItem(analysisKey);

    // Clear current dataset if it's the one being deleted
    const currentId = getCurrentDatasetId();
    if (currentId === uploadId) {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_DATASET);
    }
  } catch (error) {
    console.error('Error deleting dataset:', error);
    throw new Error('Failed to delete dataset');
  }
};

export const getAllDatasets = (): StoredDataset[] => {
  const datasets = getStoredDatasets();
  return Object.values(datasets).sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
};

// Enhanced cleanup functions
export const clearAllData = (): void => {
  try {
    console.log('🧹 Clearing all EDA data from browser storage...');
    
    // Clear all EDA-related data from localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear all sessionStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });

    // Clear analysis results
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEYS.ANALYSIS_RESULTS)) {
        localStorage.removeItem(key);
      }
    });

    console.log('✅ All EDA data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing all data:', error);
  }
};

export const clearCurrentSessionData = (): void => {
  try {
    const currentSessionId = getSessionId();
    console.log(`🧹 Clearing data for session: ${currentSessionId}`);
    
    // Get all datasets and remove only those from current session
    const datasets = getStoredDatasets();
    let removedCount = 0;
    
    Object.keys(datasets).forEach(datasetId => {
      const dataset = datasets[datasetId];
      if (dataset.sessionId === currentSessionId) {
        delete datasets[datasetId];
        removedCount++;
        
        // Also remove associated analysis results
        const analysisKey = `${STORAGE_KEYS.ANALYSIS_RESULTS}_${datasetId}`;
        localStorage.removeItem(analysisKey);
      }
    });
    
    // Update datasets in localStorage
    if (removedCount > 0) {
      localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
      console.log(`✅ Removed ${removedCount} datasets from current session`);
    }
    
    // Clear session storage
    sessionStorage.clear();
    
  } catch (error) {
    console.error('❌ Error clearing session data:', error);
  }
};

export const cleanupOldData = (maxAgeHours: number = 24): void => {
  try {
    const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    const datasets = getStoredDatasets();
    let removedCount = 0;
    
    Object.keys(datasets).forEach(datasetId => {
      const dataset = datasets[datasetId];
      const datasetTime = new Date(dataset.uploadedAt).getTime();
      
      if (datasetTime < cutoffTime) {
        delete datasets[datasetId];
        removedCount++;
        
        // Also remove associated analysis results
        const analysisKey = `${STORAGE_KEYS.ANALYSIS_RESULTS}_${datasetId}`;
        localStorage.removeItem(analysisKey);
      }
    });
    
    if (removedCount > 0) {
      localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
      console.log(`🧹 Cleaned up ${removedCount} old datasets (older than ${maxAgeHours} hours)`);
    }
    
    // Update cleanup timestamp
    localStorage.setItem(STORAGE_KEYS.CLEANUP_TIMESTAMP, Date.now().toString());
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
};

export const shouldPerformCleanup = (): boolean => {
  try {
    const lastCleanup = localStorage.getItem(STORAGE_KEYS.CLEANUP_TIMESTAMP);
    if (!lastCleanup) return true;
    
    const timeSinceCleanup = Date.now() - parseInt(lastCleanup);
    const sixHours = 6 * 60 * 60 * 1000;
    
    return timeSinceCleanup > sixHours;
  } catch (error) {
    return true;
  }
};

// Helper functions
const getStoredDatasets = (): Record<string, StoredDataset> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DATASETS);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error parsing stored datasets:', error);
    return {};
  }
};

const generateId = (): string => {
  return `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Storage quota management
export const getStorageInfo = () => {
  try {
    const datasets = getAllDatasets();
    const totalDatasets = datasets.length;
    const totalSize = datasets.reduce((sum, dataset) => sum + dataset.fileSize, 0);
    
    // Estimate localStorage usage (rough calculation)
    let storageUsed = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        storageUsed += localStorage[key].length;
      }
    }

    return {
      totalDatasets,
      totalSize,
      storageUsed,
      storageUsedMB: (storageUsed / (1024 * 1024)).toFixed(2),
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      totalDatasets: 0,
      totalSize: 0,
      storageUsed: 0,
      storageUsedMB: '0',
    };
  }
};

// Initialize cleanup on module load
export const initializeStorageCleanup = (): void => {
  // Perform cleanup if needed
  if (shouldPerformCleanup()) {
    cleanupOldData(24); // Clean data older than 24 hours
  }
  
  // Set up periodic cleanup
  setInterval(() => {
    if (shouldPerformCleanup()) {
      cleanupOldData(24);
    }
  }, 60 * 60 * 1000); // Check every hour
};