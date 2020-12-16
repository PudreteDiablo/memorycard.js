# MemoryCard-JS
Save user progress in javascript-based games.

[![npm version](https://badge.fury.io/js/memorycard-js.svg)](//npmjs.com/package/memorycard-js)
[![Support](https://img.shields.io/badge/Support%20Project-Patreon-orange.svg)](https://patreon.com/PudreteDiablo)
[![Electron](https://img.shields.io/badge/Electron-Yes-blue.svg)](#available-platforms)
[![Cordova](https://img.shields.io/badge/Cordova-Yes-blue.svg)](#available-platforms)
[![Browsers](https://img.shields.io/badge/Browsers-Yes-blue.svg)](#available-platforms)
[![Backend Server](https://img.shields.io/badge/Backend%20Servers-Yes-blue.svg)](#available-platforms)

# Installation
#### Node.js (Electron/Backend-Servers)
```
npm i memorycard-js --save
```

#### Browser CDN
```
https://cdn.jsdelivr.net/npm/memorycard-js/dist/memorycard.min.js
```

#### Self-Host / Download

### Advantages
You can save time in your game development by installing this package in your current game. Don't worry about platforms compatibility or organization, With this tool you 

# Available Platforms
This tool was designed to be compatible with all useful javascript frameworks such as Electron and Cordova. Basically, the package encrypts the *data* and then saves depending on the platform where the game or application is currently running.

| Electron/Node.js | Browsers     | Cordova      | Cloud/Server   |
| :--------------: | :----------: | :----------: | :------------: |
| OS Drive         | LocalStorage | LocalStorage | Encrypted Data |

If you want to save the data in a *cloud storage*, you can easily request the encrypted data instead of save it by installing memorycard-js in you server (safer) or in the client-side. Also you can use [Strict Mode](#strict-mode) and [Card Key](#card-key) to improve the security.

# Reference