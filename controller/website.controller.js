const BlogArticle = require("../models/website/BlogArticle");
const Service = require("../models/website/Service");
const Team = require("../models/website/Team");

async function getDiscordCount() {
  let resp;
  await fetch(
    "https://discord.com/api/v9/invites/odaclan?with_counts=true&with_expiration=true"
  )
    .then((res) => res.json())
    .then((res) => (resp = res));

  return resp;
}

exports.getHomepageData = async (req, res) => {
  const discord = await getDiscordCount();
  const numbers = {
    discord: discord.approximate_member_count,
    analyzedProjects: 69,
    other: 1,
  };

  const servicesHome = await Service.find({ home: true });

  const response = {
    numbers: numbers,
    servicesHome: servicesHome,
  };

  res.send(response);
};

exports.getTeam = async (req, res) => {
  const team = await Team.find({}).sort([["prio", 1]]);

  const response = {
    team: team,
  };

  res.send(response);
};

exports.getServices = async (req, res) => {
  const services = {
    development: await Service.find({ macroCategory: "Development" }),
    marketing: await Service.find({ macroCategory: "Marketing" }),
    gameAndProject: await Service.find({ macroCategory: "Game & Project" }),
  };

  res.send(services);
};

exports.getServiceDetail = async (req, res) => {
  const id = req.query.service;

  let serviceDetail = await Service.findOne({ serviceId: id });


  res.send(serviceDetail);
};

exports.getBlogArticles = async (req, res) => {
  const resp = await BlogArticle.find({});
  res.send(resp);
};
