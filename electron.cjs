const { app, BrowserWindow } = require("electron");

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		title: "Pomodoro",
		width: 800,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
	createWindow();
	setInterval(detectSiteUsage, 5000);
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
