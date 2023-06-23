import { atom } from "recoil";

export const appTitleAtom = atom({
  key: "appTitleAtom",
  default: "Synapse > src > atoms.js",
});

export const editorStateAtom = atom({
  key: "editorStateAtom",
  default: "",
});

export const rootDirNameAtom = atom({
  key: "rootDirNameAtom",
  default: "Synapse",
});

export const ZoteroAPIKeyAtom = atom({
  key: "ZoteroAPIKeyAtom",
  default: "o1xjmOyIb58F1Snlo8WntfEm",
});

export const ZoteroUserIDAtom = atom({
  key: "ZoteroUserIDAtom",
  default: "6692974",
});

export const directoryListingAtom = atom({
  key: "directoryListingAtom",
  default: [
    "changelog.txt",
    "debug.js",
    "license.txt",
    "package.json",
    "readme.md",
    "release.js",
    "controllers/api.js",
    "controllers/chat.js",
    "controllers/default.js",
    "databases/channels.json",
    "databases/users.json",
    "definitions/auth.js",
    "definitions/convertors.js",
    "definitions/globals.js",
    "definitions/helpers.js",
    "definitions/localization.js",
    "definitions/merge.js",
    "definitions/operations.js",
    "definitions/scheduler.js",
    "models/account.js",
    "models/channels.js",
    "models/favorites.js",
    "models/login.js",
    "models/messages.js",
    "models/tasks.js",
    "models/users.js",
    "public/favicon.ico",
    "public/icon.png",
    "views/index.html",
    "views/login.html",
    "views/notification.html",
    "public/css/bootstrap.min.css",
    "public/css/default.css",
    "public/css/ui.css",
    "public/forms/files.html",
    "public/forms/formblacklist.html",
    "public/forms/formchannel.html",
    "public/forms/formuser.html",
    "public/forms/help.html",
    "public/img/preloader.gif",
    "public/photos/face.jpg",
    "public/js/default.js",
    "public/js/jctajr.min.js",
    "public/js/ui.js",
    "public/templates/chat.html",
    "public/templates/favorite.html",
    "public/templates/settings.html",
    "public/templates/tasks.html",
    "public/templates/users.html",
  ],
});
