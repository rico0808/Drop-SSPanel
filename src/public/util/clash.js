const join = require("path").join;
const public = require("path").join(__dirname, "../");
const config = require(public + "./config");

async function POST(url, body) {
  let res;
  res = await fetch(url, {
    url,
    method: "POST",
    headers: { "Content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  res = await res.json();
  res = await res;
  return res;
}

async function GET(url) {
  let res;
  res = await fetch(url, {
    url,
    method: "GET",
    headers: { "Content-type": "application/json" },
  });
  res = await res.json();
  res = await res;
  return res;
}

async function PUT(url, name) {
  let res;
  const body = JSON.stringify({ name });
  res = await fetch(url, {
    url,
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body,
  });
  if (res.status === 204) {
    return true;
  }
  return false;
}

async function PATCH(url, mode) {
  let res;
  const body = JSON.stringify({ mode });
  res = await fetch(url, {
    url,
    method: "PATCH",
    headers: { "Content-type": "application/json" },
    body,
  });
  if (res.status === 204) {
    return true;
  }
  return false;
}

const clashURL = "http://127.0.0.1:9090";

class clash {
  static async proxies() {
    return await GET(clashURL + "/proxies");
  }

  static async getNow(mode) {
    return await GET(clashURL + "/proxies/" + mode);
  }

  static async setProxy(name, mode) {
    return await PUT(clashURL + "/proxies/" + mode, name);
  }

  static async getConfig() {
    return await GET(clashURL + "/configs");
  }

  static async setConfig(mode) {
    return await PATCH(clashURL + "/configs", mode);
  }
}

module.exports = clash;
