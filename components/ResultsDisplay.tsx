import React from 'react';
import type { MeetingNotes, TranscriptEntry } from '../types';

interface ResultsDisplayProps {
  notes: MeetingNotes;
  onReset: () => void;
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
    <div className="flex items-center mb-4">
      <div className="mr-3 text-brand-primary">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
    </div>
    <div className="text-slate-600 space-y-3">{children}</div>
  </div>
);

const SummaryIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ActionItemIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const DiscussionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H17z" />
    </svg>
);

const TranscriptionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ notes, onReset }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">Meeting Notes</h2>
        <p className="text-slate-500 mt-1">Here is the AI-generated summary of your meeting.</p>
      </div>

      <SectionCard title="Summary" icon={<SummaryIcon />}>
        <p className="leading-relaxed">{notes.summary}</p>
      </SectionCard>

      <SectionCard title="Action Items" icon={<ActionItemIcon />}>
        {notes.actionItems.length > 0 ? (
          <ul className="space-y-3">
            {notes.actionItems.map((item, index) => (
              <li key={index} className="flex items-start p-3 bg-slate-50 rounded-md">
                <span className="text-brand-secondary font-bold mr-3">{index + 1}.</span>
                <div>
                  <p className="font-medium text-slate-800">{item.task}</p>
                  <p className="text-sm text-slate-500"><strong>Owner:</strong> {item.owner}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No specific action items were identified.</p>
        )}
      </SectionCard>

      <SectionCard title="Discussion Highlights" icon={<DiscussionIcon />}>
        {notes.discussionPoints.length > 0 ? (
          <ul className="list-disc list-inside space-y-2">
            {notes.discussionPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        ) : (
          <p>No specific discussion points were extracted.</p>
        )}
      </SectionCard>

      <SectionCard title="Full Transcription" icon={<TranscriptionIcon />}>
        <details open>
          <summary className="cursor-pointer font-medium text-brand-secondary hover:underline">
            Click to view/hide transcription
          </summary>
            {notes.transcription.length > 0 ? (
                <div className="mt-4 space-y-4 bg-slate-100 p-4 rounded-md max-h-96 overflow-y-auto font-sans text-sm">
                    {notes.transcription.map((entry: TranscriptEntry, index: number) => (
                    <div key={index} className="grid grid-cols-[auto,1fr] gap-x-4 items-start">
                        <p className="font-bold text-slate-800 text-right">{entry.speaker}:</p>
                        <p className="text-slate-600 leading-relaxed">{entry.quote}</p>
                    </div>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-slate-500">No transcription available.</p>
            )}
        </details>
      </SectionCard>

      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="px-8 py-3 text-base font-medium text-white bg-brand-primary rounded-lg border border-transparent hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
        >
          Analyze Another Meeting
        </button>
      </div>
    </div>
  );
};