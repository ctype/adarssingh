import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Upload, FileText, AlertCircle, Database, HardDrive, Shield, Clock } from 'lucide-react';
import { parseCSV } from '../utils/dataProcessor';
import { setDataset, uploadDataset, saveDataset, setError, clearError } from '../store/datasetSlice';
import { AppDispatch } from '../store';
import { getStorageInfo, cleanupOldData } from '../services/storageService';

const FileUpload: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [storageInfo, setStorageInfo] = useState({
    totalDatasets: 0,
    storageUsedMB: '0',
  });

  // Update storage info on component mount and periodically
  useEffect(() => {
    const updateStorageInfo = () => {
      const info = getStorageInfo();
      setStorageInfo({
        totalDatasets: info.totalDatasets,
        storageUsedMB: info.storageUsedMB,
      });
    };

    updateStorageInfo();
    const interval = setInterval(updateStorageInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleFile = useCallback(async (file: File) => {
    dispatch(clearError());

    // Validation
    if (!file.name.toLowerCase().endsWith('.csv')) {
      dispatch(setError('Please upload a CSV file'));
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      dispatch(setError('File size must be less than 50MB'));
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Clean up old data before processing new file
      cleanupOldData(1); // Clean data older than 1 hour

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Parse CSV first
      const processedData = await parseCSV(file);
      
      if (processedData.columns.length > 100) {
        dispatch(setError('Dataset cannot have more than 100 columns'));
        setUploading(false);
        clearInterval(progressInterval);
        return;
      }

      if (processedData.data.length > 100000) {
        dispatch(setError('Dataset cannot have more than 100,000 rows for performance reasons'));
        setUploading(false);
        clearInterval(progressInterval);
        return;
      }

      // Upload to storage (simulated)
      const uploadResult = await dispatch(uploadDataset(file)).unwrap();
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Set parsed data in Redux
      dispatch(setDataset(processedData));
      
      // Save dataset to localStorage
      await dispatch(saveDataset({
        uploadId: uploadResult.uploadId,
        fileName: file.name,
        fileSize: file.size,
        data: processedData.data,
        columns: processedData.columns,
        columnTypes: processedData.columnTypes,
      }));
      
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to process file'));
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [dispatch]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
        Upload CSV File
      </h2>
      
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? '#3b82f6' : '#d1d5db'}`,
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: dragActive ? '#eff6ff' : '#f9fafb',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          style={{ display: 'none' }}
          id="file-upload"
          disabled={uploading}
        />
        
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {uploading ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <HardDrive size={32} color="#3b82f6" />
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      border: '3px solid #e5e7eb',
                      borderTop: '3px solid #3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                </div>
                <div style={{ width: '100%', maxWidth: '300px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    <span>Processing and saving to localStorage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#e5e7eb', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{ 
                        width: `${uploadProgress}%`, 
                        height: '100%', 
                        backgroundColor: '#3b82f6',
                        transition: 'width 0.3s ease',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <Upload size={48} color="#3b82f6" />
                  <HardDrive size={32} color="#10b981" />
                </div>
                <div>
                  <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                    Drop your CSV file here or click to browse
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                    Supports files up to 50MB with up to 100 columns and 100K rows
                  </p>
                  <p style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '500' }}>
                    Files are stored locally in your browser
                  </p>
                </div>
              </>
            )}
          </div>
        </label>
      </div>

      {/* File Requirements */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
          File Requirements
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '12px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#10b981" />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              CSV format with headers
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} color="#3b82f6" />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Maximum 100 columns
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={16} color="#8b5cf6" />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Up to 50MB file size
            </span>
          </div>
        </div>
      </div>

      {/* Supported Data Types */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
          Supported Data Types
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '8px' 
        }}>
          {[
            { type: 'Numeric', desc: 'Integers, decimals, scientific notation', color: '#3b82f6' },
            { type: 'Categorical', desc: 'Text, strings, categories', color: '#10b981' },
            { type: 'Boolean', desc: 'True/False, Yes/No, 1/0', color: '#f59e0b' },
            { type: 'Date/Time', desc: 'ISO dates, timestamps', color: '#8b5cf6' },
          ].map(item => (
            <div key={item.type} style={{ 
              padding: '8px 12px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '6px',
              borderLeft: `3px solid ${item.color}`
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                {item.type}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Storage Info */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '8px',
        border: '1px solid #bae6fd'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Shield size={20} color="#0284c7" />
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#0284c7' }}>
            Privacy & Storage
          </span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={16} color="#0369a1" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#0369a1' }}>
                Local Storage Only
              </div>
              <div style={{ fontSize: '12px', color: '#0369a1' }}>
                Data never leaves your device
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="#0369a1" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#0369a1' }}>
                Auto-Cleanup
              </div>
              <div style={{ fontSize: '12px', color: '#0369a1' }}>
                Cleared when tab closes
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '12px', 
          padding: '8px 12px', 
          backgroundColor: '#ffffff', 
          borderRadius: '4px',
          fontSize: '12px',
          color: '#0369a1'
        }}>
          <strong>Current Storage:</strong> {storageInfo.totalDatasets} datasets, {storageInfo.storageUsedMB}MB used
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default FileUpload;