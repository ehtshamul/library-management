const { getchat } = require("./helpchat");

async function chatbotapi(req, res) {
    try {
        const { message } = req.body;

        const reply = await getchat(message);

        res.status(200).json({
            success: true,
            message: "Chatbot response fetched successfully",
            data: reply,
        });
    } catch (error) {
        console.error("Error in chatbot API:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = { chatbotapi };
