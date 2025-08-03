import React, { useState, useRef, useEffect, useCallback } from 'react';

interface InputAreaProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
}

// Icons
const UploadIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const RecordIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>);
const FileUploadIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>);
const FileIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>);

export const FileUpload: React.FC<InputAreaProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [recorderError, setRecorderError] = useState<string | null>(null);

  const cleanUpRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    mediaRecorderRef.current = null;
    streamRef.current = null;
    timerRef.current = null;
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingSeconds(0);
  }, []);

  useEffect(() => {
    return cleanUpRecording;
  }, [cleanUpRecording]);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setRecorderError(null);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation();
    handleFileSelect(e.dataTransfer.files?.[0] || null);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation();
  };

  const startRecording = async () => {
    setRecorderError(null);
    setFile(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
                setFile(audioFile);
                cleanUpRecording();
            };
            
            mediaRecorderRef.current.start();
            setIsRecording(true);
            timerRef.current = window.setInterval(() => {
                setRecordingSeconds(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            setRecorderError("Could not access microphone. Please check permissions and try again.");
            cleanUpRecording();
        }
    } else {
        setRecorderError("Recording is not supported by your browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const TabButton: React.FC<{tabName: 'upload' | 'record', children: React.ReactNode}> = ({ tabName, children }) => (
    <button onClick={() => { setActiveTab(tabName); setFile(null); setRecorderError(null); cleanUpRecording(); }}
      className={`flex items-center justify-center w-1/2 p-3 font-semibold text-sm transition-colors rounded-t-lg focus:outline-none ${ activeTab === tabName ? 'bg-white text-brand-primary border-b-2 border-brand-primary' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}>
      {children}
    </button>
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 w-full transition-all duration-300">
      <div className="flex border-b border-slate-200 mb-6 bg-slate-50 rounded-t-lg">
        <TabButton tabName="upload"><UploadIcon/> Upload File</TabButton>
        <TabButton tabName="record"><RecordIcon/> Record Live</TabButton>
      </div>
      
      {!file && (
        <>
            {activeTab === 'upload' && (
                <div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-4 text-center">Upload Your Meeting Recording</h2>
                    <label onDrop={handleDrop} onDragOver={handleDragOver} htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 px-6 transition bg-white border-2 border-slate-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-brand-primary focus:outline-none">
                        <FileUploadIcon />
                        <span className="font-medium text-slate-600">Drop files to attach, or <span className="text-brand-secondary underline">browse</span></span>
                        <span className="text-xs text-slate-500">Supports audio and video files</span>
                        <input id="file-upload" ref={inputRef} type="file" accept="audio/*,video/*" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                </div>
            )}
            {activeTab === 'record' && (
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Record a Live Meeting</h2>
                    <div className="flex flex-col items-center justify-center h-48 bg-slate-100 rounded-md">
                        {isRecording ? (
                            <>
                                <div className="text-5xl font-mono text-red-500 animate-pulse">{formatTime(recordingSeconds)}</div>
                                <p className="mt-2 text-slate-500">Recording in progress...</p>
                            </>
                        ) : (
                           <>
                             <RecordIcon/>
                             <p className="mt-2 text-slate-600">Click below to start recording</p>
                           </>
                        )}
                    </div>
                     {recorderError && <p className="text-red-500 text-sm mt-2">{recorderError}</p>}
                    <button onClick={isRecording ? stopRecording : startRecording} className={`mt-4 px-6 py-3 font-medium rounded-lg text-white transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-primary hover:bg-brand-secondary'}`}>
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                </div>
            )}
        </>
      )}

      {file && (
        <div className="mt-6 p-3 bg-brand-light rounded-lg flex items-center justify-between animate-subtle-pulse">
          <div className="flex items-center space-x-3 overflow-hidden">
            <FileIcon />
            <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
          </div>
          <button onClick={() => setFile(null)} className="text-slate-500 hover:text-red-600 text-xl font-bold flex-shrink-0 ml-2">&times;</button>
        </div>
      )}

      <div className="mt-6 text-center">
        <button onClick={() => file && onAnalyze(file)} disabled={!file || isLoading} className="w-full md:w-auto px-8 py-3 text-base font-medium text-white bg-brand-primary rounded-lg border border-transparent hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Analyzing...' : 'Generate Meeting Notes'}
        </button>
      </div>
    </div>
  );
};