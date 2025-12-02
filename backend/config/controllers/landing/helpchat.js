const Addbook = require("../../models/admin/Addbook");

async function getchat(message) {
    const text = message.toLowerCase().trim();

    // ⭐ BASIC REPLIES
    if (text.includes("hello") || text.includes("hi")) {
        return "Hello! How can I assist you today?";
    }

    if (text.includes("help")) {
        return "Sure! What do you need help with?";
    }

    if (text.includes("library hours")) {
        return "Our library is open from 9 AM to 6 PM, Monday to Saturday.";
    }

    if (text.includes("location") || text.includes("where") || text.includes("address")) {
        return "Information Management Department, Punjab University Lahore.";
    }

    // ⭐ BOOK SEARCH LOGIC
    try {
        const books = await Addbook.find({
            $or: [
                { title: { $regex: text, $options: "i" } },
                { author: { $regex: text, $options: "i" } },
                { categories: { $elemMatch: { $regex: text, $options: "i" } } }, // array field
                { tags: { $elemMatch: { $regex: text, $options: "i" } } },       // array field
                { keywords: { $elemMatch: { $regex: text, $options: "i" } } }    // array field
            ]
        }).limit(5);

        if (books.length > 0) {
            let response = "📚 Books Found:\n\n";
            books.forEach(book => {
                response += `• ${book.title} — ${book.author}\n`;
            });
            return response;
        }

        return "I couldn't find any books matching your query. Please try another title or keyword.";
    } catch (err) {
        console.error("Error searching books:", err);
        return "Oops! Something went wrong while searching the books. tell me you books you want. this books name and keywords. for you need books i will find. ";
    }
}

module.exports = { getchat };
