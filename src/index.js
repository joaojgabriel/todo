import "./style.css";
import * as lg from "./Logic";

const inbox = [];
const addTaskButton = document.querySelector("button#add-task");
const newTaskInput = document.querySelector("input#new-task");

// When user clicks + Add Task
addTaskButton.addEventListener("click", () => {
  // Create a task object and add it to inbox list
  const newTask = lg.createTaskObject(newTaskInput.value);
  if (!newTask) return;
  inbox.push(newTask);
});
