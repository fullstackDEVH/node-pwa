const express = require("express");
const bodyParser = require("body-parser");
const webpush = require("web-push");
const cors = require("cors");

const app = express();
const port = 3000;

// Thay thế bằng các khóa VAPID của bạn
const vapidPublicKey =
  "BMHXipBHt-A4qkUW4CJAhY9Tz5u2aETHQrjdC2abao18-EfiLCFaFTf4CPz2TBdkmgDR7xxOHr2WyILu_Hf5TOI";
const vapidPrivateKey = "9Ns7g8ZHBXasIe8LaXFkI3jDwaeqRjCuTZ0lOm3o39g";

webpush.setVapidDetails(
  "mailto:huyhg2521@gmail.com",
  vapidPublicKey,
  vapidPrivateKey
);

app.use(cors());

app.use(bodyParser.json());

let subscriptions = [];

// Route để lưu trữ subscription
app.get("/", (req, res) => {
  res.status(201).json({ message: "hello" });
});

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  console.log("Received subscription:", subscription);
  webpush
    .sendNotification(subscription, "hekko", {
      TTL: 60,
    })
    .then(() => {
      return res.status(200).json({ message: "Notification sent!" });
    })
    .catch((e) => console.log(e));
});

// Route để gửi thông bá
app.post("/sendNotification", (req, res) => {
  const notificationPayload = req.body;
  const promises = subscriptions.map((subscription) =>
    webpush.sendNotification(
      subscription,
      JSON.stringify(notificationPayload),
      {
        TTL: 60,
      }
    )
  );

  Promise.all(promises)
    .then(() =>
      res.status(200).json({ message: "Notification sent successfully." })
    )
    .catch((err) => {
      console.error("Error sending notification:", err);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
