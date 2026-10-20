module.exports = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    app: 'HustleForge AI',
    version: '1.0.0',
    platform: 'Vercel Serverless',
    models: {
      text: 'Google Gemma-2-9b-it',
      vision: 'Google PaliGemma-3b',
      tabular: 'Prior Labs TabPFN-3.5',
      speech: 'ElevenLabs Multilingual v2',
      search: 'SerpApi Grounding'
    }
  });
};
