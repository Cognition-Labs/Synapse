import { atom, selector } from "recoil";

export const activePersonAtom = atom({
  key: "activePersonAtom",
  default: "",
});

export const appTitleAtom = atom({
  key: "appTitleAtom",
  default: "Synapse > src > atoms.js",
});

export const rootDirNameAtom = atom({
  key: "rootDirNameAtom",
  default: "Synapse",
});

export const tabsAtom = atom({
  key: "tabsAtom",
  default: [
    {
      title: "atoms.js",
      path: "src/atoms.js",
      content: "atoms hello world",
      active: true,
    },
    {
      title: "license.txt",
      path: "license.txt",
      content: "this is license",
      active: false,
    },
  ],
});

export const zoteroQueryAtom = atom({
  key: "zoteroQueryAtom",
  default: "",
});

export const activeTabSelector = selector({
  key: "activeTabSelector",
  get: ({ get }) => {
    const tabs = get(tabsAtom);
    if (tabs.length === 0) {
      return null;
    }
    const activeTab = tabs.find((tab) => tab.active);
    const activeTabID = tabs.findIndex((tab) => tab.active);
    return { ...activeTab, id: activeTabID };
  },
  set: ({ get, set }, newActiveTabID) => {
    const tabs = get(tabsAtom);
    if (tabs.length === 0) {
      return;
    }
    const newTabs = tabs.map((tab, tabID) => {
      if (tabID === newActiveTabID) {
        return { ...tab, active: true };
      } else {
        return { ...tab, active: false };
      }
    });
    set(tabsAtom, newTabs);
  },
});

export const editorStateSelector = selector({
  key: "editorStateSelector",
  get: ({ get }) => {
    const activeTab = get(activeTabSelector);
    return activeTab ? activeTab.content : "";
  },
  set: ({ get, set }, newContent) => {
    const activeTab = get(activeTabSelector);
    if (!activeTab) {
      return;
    }
    const tabs = get(tabsAtom);
    const newTabs = tabs.map((tab, tabID) => {
      if (tabID === activeTab.id) {
        return { ...tab, content: newContent };
      } else {
        return tab;
      }
    });
    set(tabsAtom, newTabs);
  },
});

export const selectionStateAtom = atom({
  key: "selectionStateAtom",
  default: { selectionText: "", cursorPosition: { line: 1, column: 1 } },
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
