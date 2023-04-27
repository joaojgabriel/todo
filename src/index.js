import "./style.css";
import * as lg from "./Logic";

const Context = (() => {
  let current = "default";
  const map = { default: [] };
  let count = 0;
  return {
    getCurrent() {
      return current;
    },
    change(context) {
      // Changes context and returns appropriate task list
      current = context;

      if (!map[current]) {
        map[current] = [];
      }

      if (current === "default") {
        return [].concat(...Object.values(map));
      }
      return map[current];
    },
    indexTask(taskObject) {
      count += 1;
      const indexedTask = { ...taskObject, index: count };
      return indexedTask;
    },
    addTask(indexedTask) {
      map[current].push(indexedTask);
    },
    deleteTask({ context, index }) {
      const { length } = map[context];
      for (let i = 0; i < length; i += 1) {
        if (map[context][i].index === index) {
          map[context].splice(i, 1);
        }
      }
    },
    modifyTask({ context, index }, changeObject) {
      map[context].forEach((task) => {
        if (task.index === index) {
          [...Object.entries(changeObject)].forEach(([key, value]) => {
            // eslint-disable-next-line no-param-reassign
            task[key] = value;
          });
        }
      });
    },
    isContext(name) {
      return name in map;
    },
  };
})();

const projectHeader = document.querySelector("h2.project-header");
const newTaskInput = document.querySelector("input#new-task");
const dueDateInput = document.querySelector("input#due-date");
const plusButton = document.querySelector("button#add-task");
const taskList = document.querySelector("ul#task-list");

const nav = document.querySelector("nav");
const inboxButton = document.querySelector("button#inbox");
const addProjectButton = document.querySelector("button#add-project");

const projectMenu = document.querySelector("#project-menu");
const projectInput = document.querySelector("input#new-project");

window.onload = newTaskInput.focus();

const renderTask = (indexedTask, showProject) => {
  const newTaskElement = lg.createTaskElement(indexedTask);

  const newTaskCheckbox = newTaskElement.querySelector(
    'input[type="checkbox"]'
  );
  const newTaskProject = newTaskElement.querySelector(".project-name");
  const newTaskEditButton = newTaskElement.querySelector(".edit");
  const newTaskDeleteButton = newTaskElement.querySelector(".delete");

  if (showProject) newTaskProject.classList.remove("hidden");
  else newTaskProject.classList.add("hidden");

  newTaskCheckbox.addEventListener("change", () => {
    newTaskElement.classList.toggle("completed");
    Context.modifyTask(indexedTask, { completed: newTaskCheckbox.checked });
  });

  newTaskEditButton.addEventListener("click", () => {});

  newTaskDeleteButton.addEventListener("click", () => {
    newTaskElement.remove();
    Context.deleteTask(indexedTask);
  });

  taskList.append(newTaskElement);
};

const toggleProjectMenu = (allowOpen = true) => {
  if (!allowOpen && projectMenu.classList.contains("hidden")) {
    newTaskInput.focus();
    return;
  }

  addProjectButton.classList.toggle("hidden");
  projectMenu.classList.toggle("hidden");

  if (!projectMenu.classList.contains("hidden")) {
    projectInput.focus();
  } else {
    newTaskInput.focus();
  }
};

const changeContext = (context) => {
  const isDefaultContext = context === "default";

  projectHeader.textContent = isDefaultContext ? "" : context;

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  const tasks = Context.change(context);
  toggleProjectMenu(false);
  if (!tasks) return;
  tasks.forEach((task) => renderTask(task, isDefaultContext));
};

plusButton.addEventListener("click", () => {
  const name = newTaskInput.value || null;
  if (!name) return;
  const dueDate = dueDateInput.value ? new Date(dueDateInput.value) : null;
  const context = Context.getCurrent();

  const indexedTask = Context.indexTask({
    name,
    dueDate,
    context,
    completed: false,
  });
  Context.addTask(indexedTask);

  newTaskInput.value = "";
  renderTask(indexedTask);
});

inboxButton.addEventListener("click", () => {
  changeContext("default");
});

addProjectButton.addEventListener("click", () => {
  toggleProjectMenu();

  const addButton = projectMenu.querySelector("#add");
  const cancelButton = projectMenu.querySelector("#cancel");

  addButton.addEventListener("click", () => {
    const project = projectInput.value || null;
    if (!project || Context.isContext(project)) {
      projectInput.focus();
      return;
    }
    changeContext(project);
    projectInput.value = "";

    const projectButton = lg.createProjectButton(project);
    projectButton.addEventListener("click", () => {
      changeContext(project);
    });

    nav.append(projectButton);
  });
  cancelButton.addEventListener("click", toggleProjectMenu);
});
