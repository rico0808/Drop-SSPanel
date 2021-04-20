const cocoMessage = require("./coco-message");
const { ipcRenderer } = require("electron");

function _filterRes(res) {
  if (res.ret === 0) {
    return cocoMessage.warning(res.msg);
  }
  return res;
}

class req {
  static async POST(url, body) {
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
    return _filterRes(res);
  }

  static async GET(url) {
    let res;
    res = await fetch(url, {
      url,
      method: "GET",
      headers: { "Content-type": "application/json" },
      credentials: "include",
    });
    res = await res.json();
    res = await res;
    return _filterRes(res);
  }

  static async GETClash(url) {
    let res;
    res = await fetch(url);
    res = await res.text();
    res = await res;
    return res;
  }
}

module.exports = req;
