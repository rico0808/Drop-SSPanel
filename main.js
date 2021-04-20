const { app, BrowserWindow, ipcMain } = require("electron");
const child = require("child_process").execFile;
const public = require("path").join(__dirname, "/src/public");
const ext = require("path").join(__dirname, "/src/ext");
console.log(ext);
// require("electron-reload")(public, {
//   electron: require(`${__dirname}/node_modules/electron`),
// });

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
  });
  void win.loadFile(public + "/index.html");
  // win.webContents.openDevTools();
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", async () => {
  const sysproxy = ext + "/sysproxy.exe";
  await child(sysproxy, ["set", "1"], function (err, data) {});
  app.quit();
});

ipcMain.on("loginSuccess", (event, agr) => {
  void win.loadFile(public + "/node.html");
});

ipcMain.on("backToLogin", (event, agr) => {
  void win.loadFile(public + "/index.html");
});
