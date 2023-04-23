import "./style.css";
import * as lg from "./Logic";

const inbox = [];
const addTaskButton = document.querySelector("button#add-task");
const newTaskInput = document.querySelector("input#new-task");
const taskList = document.querySelector("ul#task-list");

const renderTaskItem = (taskObject) => {
  // Append a list item with a checkbox and a title for the task
  const taskItem = document.createElement("li");
  const taskLabel = document.createElement("label");
  taskLabel.setAttribute("for", "completed");
  const completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";
  completedCheckbox.setAttribute("id", "completed");
  completedCheckbox.addEventListener("change", () => {
    // Change logically
  });
  const taskText = document.createTextNode(taskObject.task);
  taskItem.classList.add(taskObject.completed, taskObject.dueDate);

  taskLabel.append(completedCheckbox);
  taskLabel.append(taskText);
  taskItem.append(taskLabel);
  taskList.append(taskItem);
};

// When user clicks + Add Task
addTaskButton.addEventListener("click", () => {
  // Check if there is text in the input field
  if (!newTaskInput.value) return;

  // Create a task object and add it to inbox list
  const taskObject = lg.createTaskObject(newTaskInput.value);
  inbox.push(taskObject);
  newTaskInput.value = "";

  renderTaskItem(taskObject);
});
