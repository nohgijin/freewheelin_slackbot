const { default: axios } = require("axios");
const { sendForgetPullRequestNotification } = require("./slack");

const prList = [];
const notiPrList = [];
const fetchGithub = async () => {
  try {
    const repos = await axios.get(
      "https://api.github.com/repos/mathFLAT/mathflat-teacher/pulls",
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    repos.data.forEach((repo) => {
      !repo.draft &&
        prList.push({
          loginId: repo.user.login,
          full_name: repo.base.repo.full_name,
          html_url: repo.base.repo.html_url,
          url: repo._links.html.href,
          title: repo.title,
          created_at: repo.created_at,
        });
    });
  } catch (err) {
    console.log(err, "err");
  }
};

const scheduleGithub = async () => {
  await fetchGithub();
  prList.forEach((pr) => {
    const diffDate = Math.floor(
      Math.abs(new Date(pr.created_at).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (diffDate >= 1) {
      notiPrList.push({ ...pr, diffDate });
    }
  });

  sendForgetPullRequestNotification(notiPrList);
};

module.exports = scheduleGithub;
