import "./style.css";
import * as lg from "./Logic";

const Context = (() => {
  let current = "default";
  const list = [{ default: [] }];
  return {
    current() {
      return current;
    },
    change(context) {
      current = context;
    },
  };
})();

const newTaskInput = document.querySelector("input#new-task");
const dueDate = document.querySelector("input#due-date");
const plusButton = document.querySelector("button#add-task");
const taskList = document.querySelector("ul#task-list");

const nav = document.querySelector("nav");
const inboxButton = document.querySelector("button#inbox");
const addProjectButton = document.querySelector("button#add-project");

plusButton.addEventListener("click", () => {});

inboxButton.addEventListener("click", () => {})

addProjectButton.addEventListener("click", () => {});
