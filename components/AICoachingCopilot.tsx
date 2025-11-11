import React, { useState, useCallback } from 'react';
import type { AgentRiskProfile } from '../types.ts';

interface AICoachingCopilotProps {
  agent: AgentRiskProfile;
}

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gm, '<li class="list-disc list-inside ml-2">$1</li>')
        .replace(/(<li.*?>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
        .replace(/<\/ul>\s*<ul>/g, '');

    return <div className="prose prose-invert text-gray-300 space-y-2" dangerouslySetInnerHTML={{ __html: html }} />;
};

export const AICoachingCopilot: React.FC<AICoachingCopilotProps> = ({ agent }) => {
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateTips = useCallback(async () => {
    setLoading(true);
    setTips('');
    const { generateCoachingTips } = await import('../services/geminiService.ts');
    const result = await generateCoachingTips(agent);
    setTips(result);
    setLoading(false);
  }, [agent]);

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-200 mb-2">AI Coaching Co-pilot</h3>
      <p className="text-sm text-gray-400 mb-4">Generate personalized coaching points for {agent.agentName} based on their recent performance.</p>
      
      {!tips && !loading && (
        <button
          onClick={handleGenerateTips}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Generate Coaching Tips
        </button>
      )}
      
      {loading && <p className="text-center text-gray-400">Thinking...</p>}

      {tips && (
        <div className="mt-2 space-y-2">
            <SimpleMarkdown text={tips} />
        </div>
      )}
    </div>
  );
};