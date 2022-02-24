const { WebClient } = require("@slack/web-api");

const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

const getFEMember = (loginId) => {
  const FEMember = new Map([
    ["bluelion2", "승훈쌤"],
    ["hayluna", "혜은쌤"],
    ["nikaidouuu", "한울쌤"],
    ["free-cutyapple", "시온쌤"],
    ["nohgijin", "기진쌤"],
  ]);

  return FEMember.get(loginId) || loginId;
};

async function postMessageChannel(text, channelId) {
  await web.chat.postMessage({ text, channel: channelId });
}

function getLinkText(text, url) {
  console.log(text, url);
  return `<${url}|${text}>`;
}

async function sendPullRequestNotification({
  repository,
  channelId,
  url,
  title,
  loginId,
}) {
  postMessageChannel(
    `[${getLinkText(
      repository.full_name,
      repository.html_url
    )}] 새로운 PR이 도착했습니다🥳 소중한 코드리뷰 부탁드려요~ 🙏 \n<${url}|${title}> by ${getFEMember(
      loginId
    )}`,
    channelId
  );
}

async function sendForgotPullRequestNotification(pr) {
  const { loginId, full_name, html_url, url, title, diffDate } = pr;
  parsingTitle = title.replace(/\>/g, "");
  postMessageChannel(
    `[${getLinkText(
      full_name,
      html_url
    )}] ${diffDate}일이 지난 PR이 있습니다🤕 소중한 코드리뷰 부탁드려요~ 🙏 \n<${url}|${parsingTitle}> by ${getFEMember(
      loginId
    )}`,
    channelId
  );
}

module.exports = {
  sendPullRequestNotification,
  sendForgotPullRequestNotification,
  postMessageChannel,
};
