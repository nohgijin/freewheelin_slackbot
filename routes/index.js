const {
  sendPullRequestNotification,
  postMessageChannel,
} = require("../app/slack");

const express = require("express");
const router = express.Router();

const 알림채널 = "C02R2GVEYS2";

router.post("/github", function (req, res) {
  if (req.body.action === "opened") {
    if (req.body.pull_request) {
      const { pull_request, repository } = req.body;
      sendPullRequestNotification({
        channelId: 알림채널,
        repository: repository,
        url: pull_request.html_url,
        title: pull_request.title,
        loginId: pull_request.user.login,
      });
    }
  }

  res.send(200);
});

router.get("/slack", function (req, res) {
  postMessageChannel(req.query.message, 알림채널);
  res.send(200);
});

module.exports = router;
