const BorrowModel = require("../../models/admin/Borrow");
const Book = require("../../models/admin/Addbook");
const {User} = require("../../models/admin/User");

// Borrow Book Controller
const borrowBook = async (req, res) => {
  try {
    const { user, book, day } = req.body;

    // 1. Check user exists
    const userExist = await User.findById(user);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check book exists
    const bookExist = await Book.findById(book);
    if (!bookExist) {
      return res.status(404).json({ message: "Book not found" });
    }

    // 3. Validate days
    if (day < 3 || day > 14) {
      return res
        .status(400)
        .json({ message: "Borrow duration must be between 3 and 14 days" });
    }

    // 4. Check book availability
    if (bookExist.copies < 1) {
      return res.status(400).json({ message: "Book not available" });
    }

    // 5. Optional: Prevent duplicate borrowing of same book by same user
    const alreadyBorrowed = await BorrowModel.findOne({
      user,
      book,
      returned: false,
    });
    if (alreadyBorrowed) {
      return res
        .status(400)
        .json({ message: "You already borrowed this book" });
    }

    // 6. Create borrow record
    const borrow = new BorrowModel({
      book,
      user,
      duedate: new Date(Date.now() + day * 24 * 60 * 60 * 1000),
    });

    await borrow.save();

    // 7. Decrease available copies
   
    bookExist.copies -= 1;
    await bookExist.save();
    

    res.json({ message: "Book borrowed successfully", borrow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = borrowBook;
