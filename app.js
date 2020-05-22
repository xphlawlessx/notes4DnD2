const {app, BrowserWindow, Menu} = require('electron');
const fs = require('fs');
const {readdirSync, statSync} = require('fs')
const {join} = require('path')
if (require('electron-squirrel-startup')) app.quit()
const ipc = require('electron').ipcMain;
app.whenReady().then(createWindow);
let win;
const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New',
                submenu: [
                    {
                        label: 'Map',
                        accelerator: 'CmdOrCtrl+N',
                        click: function () {
                            menuItemClicked('new-map');
                        }
                    },
                    {
                        label: 'Dungeon',
                        accelerator: 'CmdOrCtrl+Shift+N',
                        click: function () {
                            menuItemClicked('new-dungeon');
                        }
                    }
                ]
            },
            {

                label: 'Save',
                submenu: [
                    {
                        label: 'Map',
                        accelerator: 'CmdOrCtrl+S',
                        click: function () {
                            menuItemClicked('save-map');
                        }
                    },
                    {
                        label: 'Dungeon',
                        accelerator: 'CmdOrCtrl+Shift+S',
                        click: function () {
                            menuItemClicked('save-dungeon');
                        }
                    }
                ]
            }
        ]
    }, {

        label: 'Debug',
        submenu: [
            {
                label: 'devtools',
                role: 'toggleDevTools',
                accelerator: 'F6',

            }
        ],
    }
];

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 675,
        webPreferences: {
            nodeIntegration: true
        },
    })
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    win.loadFile('index.html').then(() => {
        getIconImages();
    });
}


function saveDungeon(dungeonName, data) {
    let jsonMap = JSON.stringify(data)
    const dir = './saved maps';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(dir + "/" + dungeonName + ".json", jsonMap)
}

function menuItemClicked(id) {
    win.webContents.send("button", id);
}

function getIconImages() {
    const baseDir = './assets/roomIcons';
    const dirs = fs.readdirSync(baseDir).filter(function (file) {
        return fs.statSync(baseDir + '/' + file).isDirectory();
    });
    let paths = []
    for (const dir of dirs) {
        let _t = fs.readdirSync(baseDir + '/' + dir)
        for (const p of _t) {
            paths.push(baseDir + '/' + dir + '/' + p)
        }
    }
    win.webContents.send("icon-paths", paths);
}

ipc.on('dungeon', function (e, data) {
    saveDungeon(data.name, data)
})
