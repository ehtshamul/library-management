const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
    Bookid: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    Userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    borrowdate: { type: Date, default: Date.now },
    duedate: { type: Date, required: true },
    returnDate: { type: Date },  // fixed name
    status: { type: String, enum: ["borrowed", "returned", "overdue"], default: "borrowed" },
    fineAmount: { type: Number, default: 0 }
});

// =====================
// Auto-update status & fine
// =====================
borrowSchema.pre('save', function(next) {
    if (this.status === "returned") {
        if (this.returnDate && this.returnDate > this.duedate) {
            const timeDiff = this.returnDate - this.duedate;
            const daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24));
            this.fineAmount = daysOverdue * 5; // $5 fine per day
        }
    } else if (this.status === "borrowed") {
        if (this.duedate < new Date()) {
            this.status = "overdue";
        }
    }
    next();
});

module.exports = mongoose.model("Borrow", borrowSchema);
