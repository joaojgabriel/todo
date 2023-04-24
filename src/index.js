import "./style.css";

const Context = (() => {
  const contexts = {};
  return {
    getTasksFrom(context) {
      // Initialize context
      if (!contexts[context]) {
        contexts[context] = [];
      }

      // Return tasks from all contexts if we're in default
      if (context === "default") {
        return [].concat(...Object.values(contexts));
      }

      return contexts[context];
    },
    addTaskTo(task, context) {
      console.log(context)
      contexts[context].push(task);
    },
    setPropertyOf(property, value, taskName, context) {
      const pool = this.getTasksFrom(context);
      const thisTask = pool.find((t) => t.name === taskName);
      thisTask[property] = value;
    },
    isAContext(name) {
      return name in contexts;
    },
  };
})();

const runContext = (context) => {
  const addTaskButton = document.querySelector("button#add-task");
  const newTaskInput = document.querySelector("input#new-task");
  const taskList = document.querySelector("ul#task-list");
  const tasks = Context.getTasksFrom(context);

  const renderTaskItem = (taskObject) => {
    // Add a list item with a checkbox and a title for the task
    const taskItem = document.createElement("li");
    const taskLabel = document.createElement("label");
    taskLabel.setAttribute("for", "completed");
    const completedCheckbox = document.createElement("input");
    completedCheckbox.type = "checkbox";
    completedCheckbox.setAttribute("id", "completed");

    // Control the logic for Completed task
    taskLabel.addEventListener("click", () => {
      Context.setPropertyOf(
        "completed",
        completedCheckbox.checked,
        taskObject.name,
        context
      );
    });

    const taskText = document.createTextNode(taskObject.name);
    taskItem.classList.add(taskObject.completed, taskObject.dueDate);

    taskLabel.append(completedCheckbox);
    taskLabel.append(taskText);
    taskItem.append(taskLabel);
    taskList.append(taskItem);
  };

  // When user clicks + Add Task in this context
  addTaskButton.onclick = function addTask() {
    const newTaskName = newTaskInput.value;

    // Check if there is text in the input field
    if (!newTaskName) return;

    // If so, create a task object and add it to project list
    const taskObject = { name: newTaskName, dueDate: null, completed: false };

    Context.addTaskTo(taskObject, context);
    newTaskInput.value = "";

    renderTaskItem(taskObject);
  };

  // Remove all tasks being shown
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  // Render all context appropriate tasks
  tasks.forEach((task) => renderTaskItem(task));
};

const addProjectButton = document.querySelector("button#add-project");
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

  const closeNewProjectPrompt = () => {
    label.remove();
    addButton.remove();
    cancelButton.remove();

    addProjectButton.classList.remove("hidden");
  };

  // When user clicks Cancel
  cancelButton.addEventListener("click", () => {
    closeNewProjectPrompt();
    aside.classList.remove("invalid");
  });

  // When user clicks Add
  addButton.addEventListener("click", () => {
    const newProjectName = newProjectInput.value;
    const nav = document.querySelector("aside > nav");

    // Check if there is text in the input field and the project name is valid
    if (!newProjectName) return;
    if (Context.isAContext(newProjectName) || newProjectName === "default") {
      aside.classList.add("invalid");
      return;
    }

    // Reset values
    newProjectInput.value = "";
    aside.classList.remove("invalid");

    // Remove menu and initialize project
    closeNewProjectPrompt();
    runContext(newProjectName);

    // Add project button to nav
    const projectLink = document.createElement("button");
    projectLink.textContent = newProjectName;
    nav.append(projectLink);
  });
});

runContext("default");
