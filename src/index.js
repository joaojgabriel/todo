import "./style.css";
import * as lg from "./Logic";

const Inbox = (() => {
  const projects = { default: [] };
  return {
    getTasksFrom(project) {
      return projects[project];
    },
    getAllTasks() {
      return [].concat(...Object.values(projects));
    },
    addTaskToProject(task, project) {
      projects[project].push(task);
    },
    sePropertyOf(property, value, taskName, project = false) {
      const pool = project ? this.getTasksFrom(project) : this.getAllTasks();
      const thisTask = pool.find((t) => t.task === taskName);
      thisTask[property] = value;
    },
  };
})();

const addTaskButton = document.querySelector("button#add-task");
const newTaskInput = document.querySelector("input#new-task");
const taskList = document.querySelector("ul#task-list");
const addProjectButton = document.querySelector("button#add-project");

const renderTaskItem = (taskObject) => {
  // Append a list item with a checkbox and a title for the task
  const taskItem = document.createElement("li");
  const taskLabel = document.createElement("label");
  taskLabel.setAttribute("for", "completed");
  const completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";
  completedCheckbox.setAttribute("id", "completed");
  // When user clicks the text or checkbox of a task
  taskLabel.addEventListener("click", () => {
    // Toggle checked state of the task in the Inbox module
    Inbox.sePropertyOf("completed", completedCheckbox.checked, taskObject.task);
  });
  const taskText = document.createTextNode(taskObject.task);
  taskItem.classList.add(taskObject.completed, taskObject.dueDate);

  taskLabel.append(completedCheckbox);
  taskLabel.append(taskText);
  taskItem.append(taskLabel);
  taskList.append(taskItem);
};

// When user clicks + Add Task in any context
addTaskButton.addEventListener("click", () => {
  // Check if there is text in the input field
  if (!newTaskInput.value) return;

  // If so, create a task object and add it to default inbox list
  const taskObject = lg.createTaskObject(newTaskInput.value);
  Inbox.addTaskToProject(taskObject, "default");
  newTaskInput.value = "";

  renderTaskItem(taskObject);
});

// When user clicks + Add Project
addProjectButton.addEventListener("click", () => {
  const aside = document.querySelector("aside");

  // Hide Button and create a small context menu for naming the project
  addProjectButton.classList.add("hidden");

  const label = document.createElement("label");
  const labelText = document.createTextNode("Name your project");
  const textInput = document.createElement("input");
  textInput.setAttribute("type", "text");
  textInput.setAttribute("placeholder", "My Project");

  label.append(labelText);
  label.append(textInput);

  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";

  aside.append(label);
  aside.append(addButton);
  aside.append(cancelButton);

  const removeContextMenu = () => {
    label.remove();
    addButton.remove();
    cancelButton.remove();

    addProjectButton.classList.remove("hidden");
  };

  // When user clicks Cancel
  cancelButton.addEventListener("click", () => {
    removeContextMenu();
  });
});
