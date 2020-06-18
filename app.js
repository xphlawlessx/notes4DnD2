const set = require('./settings/settings.js');
const {app, BrowserWindow, Menu, screen} = require('electron');
const fs = require('fs');
const {join} = require('path')

if (require('electron-squirrel-startup')) app.quit()
const ipc = require('electron').ipcMain;
app.whenReady().then(createWindow);
let win;
let settings;
const path = './app-settings.json'

if (fs.existsSync(path)) {
    let rawdata = fs.readFileSync(path);
    settings = JSON.parse(rawdata);
} else {
    settings = new set.Settings()
}
saveSettings()


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
            },

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
    },
    {

        label: 'InitShortCuts',
        submenu: [
            {
                label: 'Roll',
                accelerator: settings.roll,
                click: function () {
                    menuItemClicked('roll-space');
                }

            },
            {
                label: 'Next',
                accelerator: settings.next,
                click: function () {
                    menuItemClicked('next-return');
                }

            },
        ],
    },
    {
        label: 'show/hide',
        submenu: [
            {
                label: 'Initiative',
                accelerator: settings.showInit,
                click: function () {
                    menuItemClicked('show-init');
                }

            },
            {
                label: 'Character form',
                accelerator: settings.showChar,
                click: function () {
                    menuItemClicked('show-char');
                }

            },
            {
                label: 'Soundboard',
                accelerator: settings.showSound,
                click: function () {
                    menuItemClicked('show-sound');
                }

            },
            {
                label: 'Canvas',
                accelerator: settings.showCanvas,
                click: function () {
                    menuItemClicked('show-canvas');
                }
            },
            {
                label: 'Bonus',
                accelerator: settings.incrementBonus,
                click: function () {
                    menuItemClicked('inc-bonus');
                }
            },
        ],
    },
    {
        label: 'roll',
        submenu: [
            {
                label: 'd4+',
                accelerator: settings.d4p,
                click: function () {
                    menuItemClicked('d4-plus');
                }

            },
            {
                label: 'd6+',
                accelerator: settings.d6p,
                click: function () {
                    menuItemClicked('d6-plus');
                }

            },
            {
                label: 'd8+',
                accelerator: settings.d8p,
                click: function () {
                    menuItemClicked('d8-plus');
                }

            },
            {
                label: 'd10+',
                accelerator: settings.d10p,
                click: function () {
                    menuItemClicked('d10-plus');
                }

            },
            {
                label: 'd12+',
                accelerator: settings.d12p,
                click: function () {
                    menuItemClicked('d12-plus');
                }

            },
            {
                label: 'd20+',
                accelerator: settings.d20p,
                click: function () {
                    menuItemClicked('d20-plus');
                }

            }, {
                label: 'd100+',
                accelerator: settings.d100p,
                click: function () {
                    menuItemClicked('d100-plus');
                }

            },
            {
                label: 'd4-',
                accelerator: settings.d4r,
                click: function () {
                    menuItemClicked('d4-roll');
                }

            },
            {
                label: 'd6-',
                accelerator: settings.d6r,
                click: function () {
                    menuItemClicked('d6-roll');
                }

            },
            {
                label: 'd8-',
                accelerator: settings.d8r,
                click: function () {
                    menuItemClicked('d8-roll');
                }

            },
            {
                label: 'd10-',
                accelerator: settings.d10r,
                click: function () {
                    menuItemClicked('d10-roll');
                }

            },
            {
                label: 'd12-',
                accelerator: settings.d12r,
                click: function () {
                    menuItemClicked('d12-roll');
                }

            },
            {
                label: 'd20-',
                accelerator: settings.d20r,
                click: function () {
                    menuItemClicked('d20-roll');
                }

            }, {
                label: 'd100-',
                accelerator: settings.d100r,
                click: function () {
                    menuItemClicked('d100-roll');
                }

            },

        ],
    }
];

function createWindow() {

    // Create the browser window.
    const {width, height} = screen.getPrimaryDisplay().workAreaSize
    win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true
        },
    })
    const menu = Menu.buildFromTemplate(template)
    win.setMenuBarVisibility(false)
    Menu.setApplicationMenu(menu)
    win.loadFile('index.html').then(() => {
        win.webContents.send("settings", settings);
        getIconImages();

    });
}

function saveSettings() {
    const _set = JSON.stringify(settings)
    fs.writeFileSync(path, _set)
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
