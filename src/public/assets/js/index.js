window.$ = window.jQuery = require("jquery");
const { shell, ipcRenderer } = require("electron");
const public = require("path").join(__dirname);

const panelAPI = require(public + "/util/api");
const baseURL = require(public + "/config").baseURL;
const cocoMessage = require(public + "/util/coco-message");

$("document").ready(async () => {
  const res = await panelAPI.getUserInfo();
  if (res.ret === 1) {
    return ipcRenderer.send("loginSuccess");
  }
  $("#loading").hide();
});

$("#login").click(async () => {
  const email = $("#email").val();
  const passwd = $("#passwd").val();
  if (!email && !passwd) {
    return cocoMessage.error("登录信息输入不完整");
  }
  const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  if (!reg.test(email)) {
    return cocoMessage.error("邮箱格式输入错误");
  }
  if (passwd.length < 6) {
    return cocoMessage.error("密码长度过短");
  }
  const res = await panelAPI.onLogin({ email, passwd });
  if (res.ret === 1) {
    cocoMessage.success("登录成功");
    ipcRenderer.send("loginSuccess");
  }
});

$("#register").click(() => {
  shell.openExternal(baseURL + "/auth/register");
});

$("#forget").click(() => {
  shell.openExternal(baseURL + "/password/reset");
});
