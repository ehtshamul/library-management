// scheduler/borrowReminder.js
const cron = require("node-cron");
const Borrow = require("../models/admin/Borrow"); // ← adjust path if needed
const nodemailer = require("nodemailer");
const moment = require("moment");
require("dotenv").config();

console.log("✅ borrowReminder.js loaded — scheduling job...");

// =============================
// Nodemailer transporter (+ verify on boot)
// =============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email_name,
    pass: process.env.Email_pass,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP verify failed:", err.message);
  } else {
    console.log("📮 SMTP ready:", success);
  }
});

// =============================
// CRON Job — every 10 minutes
// =============================
cron.schedule(
  "*/59 * * * *",
  async () => {
    const now = moment();
    const windowEnd = moment().add(2, "days").endOf("day"); // search up to tomorrow night

    console.log("⏰ Cron tick:", now.format("YYYY-MM-DD HH:mm:ss"));

    try {
      // Only active borrows (NOT returned), due within next 48h window
      const borrows = await Borrow.find({
        status: "borrowed",
        duedate: { $lte: windowEnd.toDate() },
      })
        .populate("Userid")
        .populate("Bookid");

      console.log(`📚 Candidates found: ${borrows.length}`);

      for (const record of borrows) {
        const user = record.Userid;
        const book = record.Bookid;

        if (!user || !book) {
          console.warn("⚠️ Skipping record with missing user/book:", record._id);
          continue;
        }

        // daysLeft: 1 => due tomorrow, 0 => due within 24h, negative => overdue
        const daysLeft = moment(record.duedate).diff(now, "days");

        console.log(
          `➡️ ${user.email} | "${book.title}" | duedate=${moment(
            record.duedate
          ).format("YYYY-MM-DD")} | daysLeft=${daysLeft}`
        );

        // Only today/tomorrow
        if (daysLeft >= 0 && daysLeft < 2) {
          const subject =
            daysLeft === 0
              ? `📘 "${book.title}" is due today`
              : `📘 "${book.title}" is due in ${daysLeft} day(s)`;

          const message = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
    <h2 style="color: #2c3e50; text-align: center;">📚 Library Reminder</h2>
    <p>Dear <strong>${user.name}</strong>,</p>

    <p style="font-size: 15px;">
      ${daysLeft === 0
        ? `Your borrowed book <strong>"${book.title}"</strong> is <span style="color: #e74c3c;">due today</span>. Please return it on time to avoid penalties.`
        : `Your borrowed book <strong>"${book.title}"</strong> is due in <strong>${daysLeft} day(s)</strong>. Kindly make sure to return it on or before the due date.`}
    </p>

    <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 5px solid #3498db;">
      <p style="margin: 0;"><strong>Book Title:</strong> ${book.title}</p>
      <p style="margin: 0;"><strong>Due Date:</strong> ${moment(record.duedate).format("MMMM Do, YYYY")}</p>
    </div>

    <p style="font-size: 14px;">If you’ve already returned the book, please ignore this message.</p>

    <p style="margin-top: 30px;">Thank you,<br><strong>Your Library Team</strong></p>

    <hr style="margin-top: 20px;"/>
    <p style="font-size: 12px; text-align: center; color: #777;">
      This is an automated reminder. Please do not reply to this email.
    </p>
  </div>
`;

          try {
            await transporter.sendMail({
              from: process.env.Email_name,
              to: user.email,
              subject,
              html: message,
            });

            console.log(`📧 Sent reminder to ${user.email} for "${book.title}"`);
          } catch (mailErr) {
            console.error(`❌ Mail failed to ${user.email}:`, mailErr.message);
          }
        }
      }
    } catch (err) {
      console.error("❌ Cron job error:", err);
    }
  },
  { timezone: "Asia/Karachi" }
);
