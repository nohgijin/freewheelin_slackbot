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
    "C02R2GVEYS2"
  );
}

async function sendForgetPullRequestNotification(notiPrList) {
  let text = "";
  const dateFormat = [
    "하루",
    "이틀",
    "삼일",
    "사일",
    "오일",
    "육일",
    "칠일",
    "팔일",
    "구일",
    "십일",
  ];
  notiPrList.forEach((pr, index) => {
    const { loginId, full_name, html_url, url, title, diffDate } = pr;
    const parsingTitle = title.replace(/\>/g, "");
    const parsingDate = dateFormat[diffDate - 1];
    if (index === 0) {
      text += `${getLinkText(full_name, html_url)}\n`;
    }
    text += ` ${getFEMember(
      loginId
    )}의 ${parsingDate} 숙성된 PR인 <${url}|${parsingTitle}>가 있어요 \n`;
  });
  text += "더 숙성되지 않게 해주세요! 코드리뷰를 기다리고 있을게요🐥";
  postMessageChannel(text, "C02R2GVEYS2");
}

module.exports = {
  sendPullRequestNotification,
  sendForgetPullRequestNotification,
  postMessageChannel,
};
