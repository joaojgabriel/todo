import "./style.css";
import * as lg from "./Logic";

const StateManager = (() => {
  const projects = { default: [] };
  let currentContext = "default";
  return {
    getTasksFrom(project) {
      return projects[project];
    },
    getAllTasks() {
      return [].concat(...Object.values(projects));
    },
    addTask(task) {
      projects[currentContext].push(task);
    },
    setPropertyOf(property, value, taskName, project = false) {
      const pool = project ? this.getTasksFrom(project) : this.getAllTasks();
      const thisTask = pool.find((t) => t.task === taskName);
      thisTask[property] = value;
    },
    initializeProject(name) {
      projects[name] = [];
      currentContext = name;
    },
    isAProject(name) {
      return name in projects;
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
    // Toggle checked state of the task
    StateManager.setPropertyOf(
      "completed",
      completedCheckbox.checked,
      taskObject.task
    );
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
  const newTaskName = newTaskInput.value;
  // Check if there is text in the input field
  if (!newTaskName) return;

  // If so, create a task object and add it to project list
  const taskObject = lg.createTaskObject(newTaskName);
  StateManager.addTask(taskObject);
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
  const newProjectInput = document.createElement("input");
  newProjectInput.setAttribute("type", "text");
  newProjectInput.setAttribute("placeholder", "My Project");

  label.append(labelText);
  label.append(newProjectInput);

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
    aside.classList.remove("invalid");
  });
  // When user clicks Add
  addButton.addEventListener("click", () => {
    const newProjectName = newProjectInput.value;
    const nav = document.querySelector("aside > nav");
    // Check if there is text in the input field and the project name is valid
    if (!newProjectName) return;
    if (
      StateManager.isAProject(newProjectName) ||
      newProjectName === "default"
    ) {
      aside.classList.add("invalid");
      return;
    }

    newProjectInput.value = "";
    aside.classList.remove("invalid");

    // If so, remove menu and initialize project
    removeContextMenu();
    StateManager.initializeProject(newProjectName);
  });
});
