window.$ = window.jQuery = require("jquery");
const { shell, ipcRenderer } = require("electron");
const fs = require("fs");
const child = require("child_process").execFile;

const join = require("path").join;
const public = require("path").join(__dirname);
// 打包时用这个路径
const ext = require("path").join(__dirname, "../../../");

// 开发时用这个路径
// const ext = require("path").join(__dirname, "./src/ext");

const panelAPI = require(public + "/util/api");
const clashAPI = require(public + "/util/clash");
const cocoMessage = require(public + "/util/coco-message");
const config = require(public + "/config");

let modeType = config.selector;

$("document").ready(async () => {
  const res = await panelAPI.getUserInfo();
  if (res.ret !== 1) {
    return cocoMessage.error("未知错误");
  }
  fs.unlink(ext + "/config.yml", (error) => {});
  const clash = await panelAPI.getClash(res.info.subInfo.clashr + "&newconf=1");
  fs.writeFile(ext + "/config.yml", clash, "utf8", (error) => {});
  await _runClash();
  _initUser(res.info.user);
  await _getConfig();
  const clashNode = await clashAPI.proxies();
  _filterNode(clashNode.proxies);
  _selectNode(await clashAPI.getNow(modeType));
  _setSysProxy();
});

function _initUser(user) {
  const limit = (
    (user.transfer_enable - 35595473 - 904725575) /
    1024 /
    1024 /
    1024
  ).toFixed(2);
  const expTime = user.class_expire.split(" ")[0];
  $("#limit").text(limit);
  $("#exptime").text(expTime);
  $("#loading").hide();
}

async function _runClash() {
  const clash = ext + "/win/clash.exe";
  const config = ext + "/config.yml";
  await child(clash, ["-f", config], function (err, data) {});
}

function _randomNode(val, id) {
  const nodeTip = `
    <div
    id="node-${id}"
    class="content h-14 mb-1 flex border-2 border-blue-600 transition-all items-center rounded pl-4 pr-2 justify-between cursor-pointer hover:bg-blue-600 hover:text-white"
    >
    <span>${val}</span>
    </div>`;
  $("#nodelist").append(nodeTip);
}

const node = [];
let prevNode;

function _filterNode(val) {
  const type = ["Shadowsocks", "ShadowsocksR", "v2ray", "v2Ray", "Trojan"];
  Object.keys(val).forEach((key) => {
    if (type.indexOf(val[key].type) === 1) {
      node.push(val[key]);
    }
  });
  node.forEach((val, index) => {
    _randomNode(val.name, index);
  });

  $(".content").click(function (val) {
    $(prevNode).removeClass("bg-blue-600").removeClass("text-white");
    prevNode = this;
    $(this).addClass("bg-blue-600").addClass("text-white");

    _setProxy(node[this.id.split("-")[1]].name);
  });
}

async function _getConfig() {
  const res = await clashAPI.getConfig();
  $("#" + res.mode).addClass("bg-blue-900");
  return res;
}

function _setSysProxy() {
  const sysproxy = ext + "/sysproxy.exe";
  const iplist =
    "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*";
  child(
    sysproxy,
    ["global", "http://127.0.0.1:7890", iplist],
    function (err, data) {}
  );
}

async function _setProxy(val) {
  const res = await clashAPI.setProxy(val, modeType);
  if (res) {
    _setSysProxy();
  } else {
    cocoMessage.error("出现错误请重启客户端");
  }
}

$(".mode").click(async function (val) {
  const mode = val.target.id;
  const res = await clashAPI.setConfig(mode);
  if (mode === "global") {
    modeType = "GLOBAL";
  } else {
    modeType = config.selector;
  }
  if (!res) {
    return cocoMessage.error("修改代理模式失败，请重试");
  }
  $(".mode").each(function () {
    if ($(this).attr("id") === mode) {
      $(this).addClass("bg-blue-900");
    } else {
      $(this).removeClass("bg-blue-900");
    }
  });
});

function _selectNode(val) {
  node.map((item, index) => {
    if (item.name === val.now) {
      $("#node-" + index)
        .addClass("bg-blue-600")
        .addClass("text-white");
      prevNode = "#node-" + index;
    } else {
      $("#node-" + index)
        .removeClass("bg-blue-600")
        .removeClass("text-white");
    }
  });
}
