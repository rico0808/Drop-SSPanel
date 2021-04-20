const req = require("./fetch");
const path = require("path").dirname(__dirname);
const baseURL = require(path + "/config").baseURL;

const URL = {
  login: "/auth/login",
  userInfo: "/getuserinfo",
  nodeList: "/getnodelist",
};

class API {
  static async onLogin(body) {
    const res = await req.POST(baseURL + URL.login, body);
    return res;
  }

  static async getUserInfo() {
    const res = await req.GET(baseURL + URL.userInfo);
    return res;
  }

  static async getNodeList() {
    const res = await req.GET(baseURL + URL.nodeList);
    return res;
  }

  static async getClash(url) {
    const res = await req.GETClash(url);
    return res;
  }
}

module.exports = API;
