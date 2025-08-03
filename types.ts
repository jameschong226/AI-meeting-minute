export interface ActionItem {
  task: string;
  owner: string;
}

export interface TranscriptEntry {
  speaker: string;
  quote: string;
}

export interface MeetingNotes {
  summary: string;
  actionItems: ActionItem[];
  discussionPoints: string[];
  transcription: TranscriptEntry[];
}