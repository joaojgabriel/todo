import "./style.css";
import * as lg from "./Logic";

const Context = (() => {
  let current = "default";
  const map = { default: [] };
  let count = 0;
  const addIndex = (task) => {
    count += 1;
    return { ...task, index: count };
  };
  return {
    getCurrent() {
      return current;
    },
    getProjects() {
      return [...Object.keys(map)];
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

    addTask(task) {
      const indexed = addIndex(task);
      map[current].push(indexed);

      return indexed;
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

const closeEdit = () => {
  const edit = document.querySelector(".edit-menu");
  if (edit) edit.remove();
};

const renderTask = (task, showProject) => {
  const taskElement = lg.createTaskElement(task);

  const checkbox = taskElement.querySelector('input[type="checkbox"]');
  const projectName = taskElement.querySelector(".project-name");
  const dueDateSpan = taskElement.querySelector(".due-date");
  const editButton = taskElement.querySelector(".edit");
  const deleteButton = taskElement.querySelector(".delete");

  if (showProject) projectName.classList.remove("hidden");
  else projectName.classList.add("hidden");

  checkbox.addEventListener("change", () => {
    taskElement.classList.toggle("completed");
    Context.modifyTask(task, { completed: checkbox.checked });
    if (checkbox.checked) dueDateSpan.textContent = "Completed";
    else dueDateSpan.textContent = lg.formatDueDate(task.dueDate);
  });

  editButton.addEventListener("click", () => {
    closeEdit();
    const editMenu = lg.createEditMenu(task, Context.getProjects());
    taskElement.append(editMenu);
  });

  deleteButton.addEventListener("click", () => {
    taskElement.remove();
    Context.deleteTask(task);
  });

  taskList.append(taskElement);
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
  if (!newTaskInput.value) return;

  renderTask(
    Context.addTask({
      name: newTaskInput.value,
      dueDate: dueDateInput.value ? `${dueDateInput.value}T00:00` : null,
      context: Context.getCurrent(),
      completed: false,
    })
  );

  dueDateInput.value = "";
  newTaskInput.value = "";
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
