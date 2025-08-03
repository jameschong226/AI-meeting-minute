import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { generateMeetingNotes } from './services/geminiService';
import type { MeetingNotes } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [meetingNotes, setMeetingNotes] = useState<MeetingNotes | null>(null);

  const handleAnalyze = useCallback(async (fileToAnalyze: File) => {
    if (!fileToAnalyze) {
      setError("An error occurred: The file to analyze is missing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMeetingNotes(null);

    try {
      const notes = await generateMeetingNotes(fileToAnalyze);
      setMeetingNotes(notes);
    } catch (err) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}. Please try again.`);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setMeetingNotes(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {error && <ErrorMessage message={error} />}
          
          {!meetingNotes && !isLoading && (
            <FileUpload 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading}
            />
          )}

          {isLoading && <Loader />}
          
          {meetingNotes && !isLoading && (
            <div className="w-full animate-subtle-pulse">
              <ResultsDisplay notes={meetingNotes} onReset={handleReset} />
            </div>
          )}

        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>AI Meeting Note Assistant &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;