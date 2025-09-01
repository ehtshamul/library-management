const Borrow = require("../../models/admin/Borrow");
const {User }= require("../../models/admin/User");      // FIXED
const Book = require("../../models/admin/Addbook");    // FIXED

const borrowbook = async (req, res) => {
  try {
    const { userId, bookId, borrowDate, returnDate } = req.body;

    if (!userId || !bookId || !borrowDate || !returnDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

   if (!book || book.copies < 1) return res.status(400).json({ msg: "No copies available" });
    const borrowDt = new Date(borrowDate);
    const returnDt = new Date(returnDate);
    if (borrowDt > returnDt) {
      return res.status(400).json({ message: "Return date must be after borrow date" });
    }

    // CREATE borrow using exact schema field names
    const borrow = new Borrow({
      Userid: userId,       // matches schema
      Bookid: bookId,       // matches schema
      borrowdate: borrowDt, // matches schema
      duedate: returnDt, 
       // matches schema
    });

    await borrow.save();
    console.log("Borrow record created befor book borrow:", book.copies);

    book.copies -= 1;
    await book.save();
    console.log("Borrow  afterrecord created befor book borrow:", book.copies);

    res.status(201).json({ message: "Book borrowed successfully", borrow 

    });
  } catch (error) {
    console.error("User:", User);
    console.error("Book:", Book);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { borrowbook };
