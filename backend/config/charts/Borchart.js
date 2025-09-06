const Borrow = require("../models/admin/Borrow");
const Book = require("../models/admin/Addbook");

// Get trending books / borrow data for dashboard
const trendingBooks = async (req, res) => {
  try {
    const trending = await Borrow.aggregate([
      { $sort: { borrowdate: -1 } }, // latest borrows first
      { $limit: 50 }, // adjust as needed
      {
        $lookup: {
          from: "books", // make sure MongoDB collection name is plural (check db)
          localField: "Bookid",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $lookup: {
          from: "users", // make sure collection name matches your db
          localField: "Userid",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          borrowDate: "$borrowdate",
          dueDate: "$duedate",
          returnDate: "$returnDate", // ✅ fixed to match schema
          status: 1, // ✅ directly use from schema instead of $cond
          fineAmount: 1,
          "book._id": 1,
          "book.title": 1,
          "book.category": 1,
          "book.author": 1,
          "user._id": 1,
          "user.name": 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Borrow records fetched successfully",
      data: trending,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { trendingBooks };
