const { chatbotResponse } = require('../AI/chatbot');

module.exports.getChatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await chatbotResponse(message);
        res.json({ response });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ error: 'Failed to get chatbot response' });
    }
};
