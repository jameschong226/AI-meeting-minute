
import React from 'react';

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-brand-light rounded-full text-brand-dark">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-slate-500">{description}</p>
    </div>
  </div>
);

const TranscribeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const SummarizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
);

const ActionItemsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const WelcomeScreen: React.FC = () => {
  return (
    <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center animate-subtle-pulse">
      <h2 className="text-2xl font-bold text-slate-800">Welcome to Your AI Meeting Assistant</h2>
      <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
        Stop taking manual notes. Upload your meeting's audio or video file, and let AI do the hard work for you.
      </p>
      <div className="mt-8 grid md:grid-cols-3 gap-8 text-left">
        <Feature
          icon={<TranscribeIcon />}
          title="Automatic Transcription"
          description="Get a full, accurate transcript of your entire conversation."
        />
        <Feature
          icon={<SummarizeIcon />}
          title="Concise Summaries"
          description="Receive a quick summary of the key points, decisions, and outcomes."
        />
        <Feature
          icon={<ActionItemsIcon />}
          title="Action Item Tracking"
          description="Never miss a to-do. We'll extract and list all assigned action items."
        />
      </div>
    </div>
  );
};
