import React, { useState, useCallback } from 'react';
import type { DashboardData } from '../types.ts';

interface AISummaryProps {
  data: DashboardData;
}

// A simple markdown-to-HTML renderer
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gm, '<li class="list-disc list-inside ml-2">$1</li>')
        .replace(/(<li.*?>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
        .replace(/<\/ul>\s*<ul>/g, '');

    return <div className="prose prose-invert text-gray-300" dangerouslySetInnerHTML={{ __html: html }} />;
};


export const AISummary: React.FC<AISummaryProps> = ({ data }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = useCallback(async () => {
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const { generateExecutiveSummary } = await import('../services/geminiService.ts');
      const result = await generateExecutiveSummary(data);
      setSummary(result);
    } catch (e) {
      setError('Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  }, [data]);

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl shadow-lg border border-gray-700 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">AI Executive Summary</h3>
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : '✨'}
          <span>{loading ? 'Generating...' : 'Generate AI Summary'}</span>
        </button>
      </div>
      {loading && <p className="text-center text-gray-400 mt-4">Generating insights, please wait...</p>}
      {error && <p className="text-center text-red-400 mt-4">{error}</p>}
      {summary && (
        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <SimpleMarkdown text={summary} />
        </div>
      )}
    </div>
  );
};