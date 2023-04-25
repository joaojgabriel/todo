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
    addTask(task) {
      contexts[task.project].push(task);
    },
    getAllContexts() {
      return [...Object.keys(contexts)];
    },
    deleteTask({ name, project }) {
      function iterate(propName) {
        const arr = contexts[propName];
        const { length } = arr;
        for (let j = 0; j < length; j += 1) {
          if (arr[j].name === name) {
            contexts[propName].splice(j, 1);
            return true;
          }
        }
        return false;
      }
      if (project === "default") {
        const allContexts = this.getAllContexts();
        for (let i = 0; i < allContexts.length; i += 1) {
          if (iterate(allContexts[i])) return;
        }
      } else {
        iterate(project);
      }
    },
    setPropertyOf(property, value, { name, project }) {
      const pool = this.getTasksFrom(project);
      const thisTask = pool.find((t) => t.name === name);
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
    // Create a string of HTML markup for the task item
    const taskItemHTML = `
      <li class="false ${taskObject.dueDate}">
        <label for="completed">
          <input type="checkbox" id="completed">
          ${taskObject.name}
        </label>
        <button>Edit</button>
        <button>Delete</button>
      </li>
    `;

    // Create a container element and set its innerHTML property
    const container = document.createElement("div");
    container.innerHTML = taskItemHTML;

    // Get the task item element from the container
    const taskItem = container.firstElementChild;

    // Get the completed checkbox element and add an event listener
    const completedCheckbox = taskItem.querySelector("#completed");
    const taskLabel = taskItem.querySelector("label");
    taskLabel.addEventListener("click", () => {
      // Change object
      Context.setPropertyOf("completed", completedCheckbox.checked, taskObject);
      // Change element class
      if (taskItem.classList.contains("false")) {
        taskItem.classList.replace("false", "true");
      } else {
        taskItem.classList.replace("true", "false");
      }
    });

    // Get the edit button element and add an event listener
    const editButton = taskItem.querySelector("button:nth-of-type(1)");
    editButton.addEventListener("click", () => {
      // Create a string of HTML markup for the task item
      const editMenuHTML = `
        <form class="edit">
          <label for="task">
            Task
            <input type="text" id="task"/>
          </label>
          <label for="date">
            Date
            <input type="date" id="date"/>
          </label>
          <label for="project">
            Project
            <select name="" id="project"></select>
          </label>
          <input type="submit" value="Confirm">
        </form>
      `;

      // Create a container element and set its innerHTML property
      const placeholder = document.createElement("div");
      placeholder.innerHTML = editMenuHTML;

      // Get the edit menu element from the container
      const editMenu = placeholder.firstElementChild;

      // Insert edit menu element after the task being edited
      taskItem.insertAdjacentElement("afterend", editMenu);

      // Give inputs initial values
      const editTaskInput = document.querySelector(".edit input#task");
      editTaskInput.value = taskObject.name;
      const editDateInput = document.querySelector(".edit input#date");
      editDateInput.value = taskObject.date;
      // const selectProject = document.querySelector(".edit select#project");
      // const addProjectOption = (thisProject) => {
      //   const optionName = thisProject === "default" ? "None" : thisProject;
      //   const optionInnerHTML = `
      //     <option value="${optionName}">${optionName}</option>
      //   `;

      //   // Create a container element and set innerHTML
      //   const optionPlaceholder = document.createElement("div");
      //   optionPlaceholder.innerHTML = optionInnerHTML;

      //   // Get the option placeholder element from the container
      //   const option = optionPlaceholder.firstElementChild;

      //   selectProject.append(option);
      // };

      // // Set the task's context as the first option
      // addProjectOption(taskObject.project);

      // // Add all remaining options
      // Context.getAllContexts().forEach((project) => {
      //   if (project === context) return;
      //   addProjectOption(project);
      // });
    });

    // Get the delete button element and add an event listener
    const deleteButton = taskItem.querySelector("button:nth-of-type(2)");
    deleteButton.addEventListener("click", () => {
      // Delete object
      Context.deleteTask(taskObject);
      // Delete element
      taskItem.remove();
    });

    // Add the task item element to the task list
    taskList.appendChild(taskItem);
  };

  // When user clicks + Add Task
  addTaskButton.onclick = function addTask() {
    const newTaskName = newTaskInput.value;

    // Check if there is text in the input field
    if (!newTaskName) return;

    // If so, create a task object and add it to context list
    const taskObject = {
      name: newTaskName,
      dueDate: null,
      completed: false,
      project: context,
    };

    Context.addTask(taskObject, context);
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

// When user clicks Inbox, show all tasks
(() => {
  const inboxButton = document.querySelector("button#inbox");
  inboxButton.addEventListener("click", () => {
    runContext("default");
  });
})();

// When user clicks + Add Project
(() => {
  const addProjectButton = document.querySelector("button#add-project");
  addProjectButton.addEventListener("click", () => {
    const aside = document.querySelector("aside");

    // Hide Button and create a small context menu for naming the project
    addProjectButton.classList.add("hidden");

    const container = document.createElement("div");

    container.innerHTML = `
      <label for="new-project" class="new-project">
        Name your project
      </label>
      <input id="new-project" type="text" placeholder="My Project" class="new-project">
      <button class="new-project">Add</button>
      <button class="new-project">Cancel</button>
    `;

    const [label, input, addButton, cancelButton] = container.children;

    const closeNewProjectPrompt = () => {
      [...document.querySelectorAll(".new-project")].forEach((element) =>
        element.remove()
      );
      addProjectButton.classList.remove("hidden");
    };

    // When user clicks Cancel, close menu
    cancelButton.addEventListener("click", () => {
      closeNewProjectPrompt();
      aside.classList.remove("invalid");
    });

    // When user clicks Add
    addButton.addEventListener("click", () => {
      const newProjectName = input.value;
      const nav = document.querySelector("aside > nav");

      // Check if there is text in the input field and the project name is valid
      if (!newProjectName) return;
      if (Context.isAContext(newProjectName) || newProjectName === "default") {
        aside.classList.add("invalid");
        return;
      }

      // Reset values
      input.value = "";
      aside.classList.remove("invalid");

      // Close menu and run context
      closeNewProjectPrompt();
      runContext(newProjectName);

      // Add project button to nav
      const projectLink = document.createElement("button");
      projectLink.textContent = newProjectName;
      nav.append(projectLink);

      // Change context when clicking button
      projectLink.addEventListener("click", () => {
        runContext(newProjectName);
      });
    });

    aside.append(...container.children);
  });
})();

runContext("default");
