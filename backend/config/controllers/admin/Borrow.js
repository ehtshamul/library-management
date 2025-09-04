const Borrow = require("../../models/admin/Borrow");
const { User } = require("../../models/admin/User");
const Book = require("../../models/admin/Addbook");
const mongoose = require("mongoose"); // ✅ use require for consistency

// -------------------
// Borrow a book
// -------------------
const borrowbook = async (req, res) => {
  try {
    console.log("📥 Borrow controller hit:", {
      path: req.path,
      params: req.params,
      body: req.body
    });

    const { userId, duedate } = req.body;
    const bookId = req.params.bookId.trim(); // clean param

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid bookId format" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.copies < 1) {
      return res.status(400).json({ message: "No copies available" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const dueDateObj = new Date(duedate);
    if (isNaN(dueDateObj.getTime()) || dueDateObj < new Date()) {
      return res.status(400).json({ message: "Invalid due date" });
    }

    if (user.borrowedBooks.length >= 5) {
      return res.status(400).json({ message: "User has reached the borrowing limit" });
    }

    const maxDuration = 15 * 24 * 60 * 60 * 1000;
    if (dueDateObj - new Date() > maxDuration) {
      return res.status(400).json({ message: "Due date exceeds maximum 15-day borrowing period" });
    }

    // Check if same book is already borrowed by this user
    const existingBorrow = await Borrow.findOne({
      Bookid: book._id,
      Userid: user._id,
      status: { $in: ["borrowed", "overdue"] }
    });

    if (existingBorrow) {
      return res.status(400).json({
        message: "User already borrowed this book and has not returned it yet"
      });
    }

    const borrow = new Borrow({
      Bookid: book._id,
      Userid: user._id,
      duedate: dueDateObj
    });

    await borrow.save();
    book.copies -= 1;
    await book.save();

    user.borrowedBooks.push(borrow._id);
    await user.save();

    return res.status(201).json({
      message: "Book borrowed successfully",
       borrow: borrow,
    
    });

  } catch (error) {
    console.error("Borrow Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------
// Return a book
// -------------------
const returnbooks = async (req, res) => {
  try {
    const borrowId = req.params.borrowId.trim();
    const { userId } = req.body; // ✅ frontend must send userId

    if (!mongoose.Types.ObjectId.isValid(borrowId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid borrowId or userId format" });
    }

    const borrowbook = await Borrow.findById(borrowId);
    if (!borrowbook || borrowbook.status === "returned") {
      return res.status(404).json({ message: "Borrow record not found or already returned" });
    }

    // ✅ Ensure only the same user can return
    if (borrowbook.Userid.toString() !== userId) {
      return res.status(403).json({ message: "You are not allowed to return this book" });
    }

    // ✅ Mark as returned
    borrowbook.status = "returned";
    borrowbook.returnDate = new Date(); // set return date
    await borrowbook.save();

    // ✅ Increment book copies
    const book = await Book.findById(borrowbook.Bookid);
    if (book) {
      book.copies += 1;
      await book.save();
    }

    // ✅ Remove borrow reference from that user's active list
    await User.findByIdAndUpdate(userId, {
      $pull: { borrowedBooks: borrowId }
    });

    res.json({ msg: "Book returned successfully" });
  } catch (error) {
    console.error("Return Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
// GET /api/borrow/user/:userId
const getUserBorrows = async (req, res) => {
  try {
const userId = req.params.userId?.trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // find all borrows of this user
    const borrows = await Borrow.find({ Userid: userId })
      .populate("Bookid")  // show book details
      .populate("Userid", "name email"); // optionally include user info

    // map response to include borrowId explicitly
    const formatted = borrows.map(b => ({
      borrowId: b._id,      // ✅ borrow id
      status: b.status,
      dueDate: b.duedate,
      book: b.Bookid,       // populated book details
      user: b.Userid,       // populated user details (optional)
      borrowdate: b.borrowdate,
      returnDate: b.returnDate,
      fineAmount: b.fineAmount


    }));

    res.json(formatted);

  } catch (error) {
    console.error("GetUserBorrows Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// admin get looking all borrows 

// check due dates and send email





module.exports = { borrowbook, returnbooks, getUserBorrows };
