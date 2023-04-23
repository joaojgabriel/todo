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

const renderTaskItem = (taskObject) => {
  // Append a list item with a checkbox and a title for the task
  const taskItem = document.createElement("li");
  const taskLabel = document.createElement("label");
  taskLabel.setAttribute("for", "completed");
  const completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";
  completedCheckbox.setAttribute("id", "completed");
  taskLabel.addEventListener("click", () => {
    // Inbox.sePropertyOf("completed", completedCheckbox.checked, taskObject.task);
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

  // If so, create a task object and add it to default inbox list
  const taskObject = lg.createTaskObject(newTaskInput.value);
  Inbox.addTaskToProject(taskObject, "default");
  newTaskInput.value = "";

  renderTaskItem(taskObject);
});
