const cron = require("node-cron");
const connectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("../utils/sendEmail");

cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await connectionRequestModel
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lte: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.fromUserId.emailId)),
    ];

    for (const email of listOfEmails) {
      const res = await sendEmail.run(
        "New Friend Requests pending for " + email,
        "There are new friend requests pending for you. Please check your account in devtinderpro.online."
      );
    }
  } catch (err) {
    console.error("Error in cron job:", err); 
  }
});
