import { GoogleGenAI } from "@google/genai";
import type { DashboardData, AgentRiskProfile } from '../types.ts';

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
    if (!ai) {
        // The API_KEY is assumed to be available in the execution environment as process.env.API_KEY.
        // The check for its existence is removed to prevent a ReferenceError in the browser.
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const generateExecutiveSummary = async (data: DashboardData): Promise<string> => {
    try {
        const ai = getAIClient();
        
        const topRiskAgents = data.agentRiskProfiles.slice(0, 3).map(a => `${a.agentName} (Risk: ${a.riskScore})`).join(', ');
        const topRootCauses = data.rootCauses.slice(0, 3).map(rc => `${rc.name} (${rc.count} times)`).join(', ');
        const improvers = data.topImprovers.slice(0,2).map(i => `${i.agentName} (Improved by ${-i.riskScoreChange} pts)`).join(', ');

        const prompt = `
            Analyze the following operational quality data and generate a concise executive summary in markdown format.
            Focus on the most critical insights a manager needs to know. Be direct and use bullet points.

            **Key Metrics:**
            - Overall Completion Rate: ${(data.completionRate * 100).toFixed(1)}%
            - Top 3 Agents by Risk Score: ${topRiskAgents}
            - Top 3 Root Causes: ${topRootCauses}
            - Notable Improvers: ${improvers || 'None'}
            - Persistent Underperformers Count: ${data.persistentUnderperformers.length}

            Generate the summary.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Error: Could not generate AI summary. Please check API key and network connection.";
    }
};

export const generateCoachingTips = async (agent: AgentRiskProfile): Promise<string> => {
    try {
        const ai = getAIClient();
        
        const prompt = `
            Analyze the following agent performance data and generate a set of personalized, actionable coaching tips in markdown format.
            The tone should be constructive and supportive for a manager to use in a 1-on-1 session.

            **Agent Data:**
            - Name: ${agent.agentName}
            - Risk Score: ${agent.riskScore} (A high score indicates higher risk)
            - Completion Rate: ${(agent.completionRate * 100).toFixed(1)}%
            - Acknowledgment Rate: ${(agent.acknowledgmentRate * 100).toFixed(1)}%
            - Number of Incomplete Feedbacks: ${agent.incompleteFeedbacks}

            Based on this data, provide 3 specific coaching points.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error generating coaching tips:", error);
        return "Error: Could not generate AI coaching tips.";
    }
};