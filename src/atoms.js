import { atom } from "recoil";

export const appTitleAtom = atom({
  key: "appTitleAtom",
  default: "Synapse | Cognition Labs",
});

export const editorStateAtom = atom({
  key: "editorStateAtom",
  default: "",
});
