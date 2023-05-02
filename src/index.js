import "./style.css";
import * as lg from "./Logic";

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

const Context = (() => {
  let current = "default";
  let map = { default: [] };
  let contexts = ["default"];
  let count = 0;

  const setValues = () => {
    map = JSON.parse(localStorage.getItem("map"));
    contexts = JSON.parse(localStorage.getItem("contexts"));
    count = +localStorage.getItem("count");
  };

  const populateStorage = () => {
    localStorage.setItem("map", JSON.stringify(map));
    localStorage.setItem("contexts", JSON.stringify(contexts));
    localStorage.setItem("count", count);

    setValues();
  };

  if (storageAvailable("localStorage")) {
    if (!localStorage.getItem("count")) {
      populateStorage();
    } else {
      setValues();
    }
  }

  const addIndex = (task) => {
    count += 1;
    return { ...task, index: count };
  };
  return {
    getCurrent() {
      return current;
    },
    getContexts() {
      return contexts;
    },
    set(context) {
      // Changes context and returns appropriate task list
      current = context;

      if (!map[current]) {
        map[current] = [];
        contexts = [...contexts, current];
        populateStorage();
      }

      if (current === "default") {
        return [].concat(...Object.values(map));
      }

      return map[current];
    },

    addTask(task) {
      const indexed = addIndex(task);
      map[current].push(indexed);
      populateStorage();
      return indexed;
    },
    deleteTask({ context, index }) {
      const { length } = map[context];
      for (let i = 0; i < length; i += 1) {
        if (map[context][i].index === index) {
          map[context].splice(i, 1);
        }
      }
      populateStorage();
    },
    modifyTask({ context, index }, changeObject) {
      const taskLocation = map[context].findIndex(
        (task) => task.index === index
      );

      [...Object.entries(changeObject)].forEach(([key, value]) => {
        map[context][taskLocation][key] = value;
      });

      const task = map[context][taskLocation];
      if (changeObject.context) {
        map[changeObject.context].push(task);
        map[context].splice(taskLocation, 1);
      }
      populateStorage();
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
const addProjectButton = document.querySelector("button#add-project");

const projectMenu = document.querySelector("#project-menu");
const projectInput = document.querySelector("input#new-project");

window.onload = () => {
  newTaskInput.value = "";
  newTaskInput.focus();
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

const closeEdit = () => {
  const edit = document.querySelector(".edit-menu");
  if (edit) edit.remove();
};

const renderTask = (task, showProject) => {
  const taskElement = lg.createTaskElement(task);

  const checkbox = taskElement.querySelector(".checkbox");
  const projectName = taskElement.querySelector(".project-name");
  const dueDateSpan = taskElement.querySelector(".due-date");
  const editButton = taskElement.querySelector(".edit");
  const deleteButton = taskElement.querySelector(".delete");

  if (showProject) projectName.classList.remove("hidden");
  else projectName.classList.add("hidden");

  checkbox.addEventListener("change", () => {
    taskElement.classList.toggle("completed");
    Context.modifyTask(task, { completed: checkbox.checked });
    dueDateSpan.textContent = checkbox.checked
      ? "Completed"
      : lg.formatDueDate(task.dueDate);
  });

  editButton.addEventListener("click", () => {
    closeEdit();
    const editMenu = lg.createEditMenu(task, Context.getContexts());

    editMenu.onsubmit = (event) => {
      event.preventDefault();

      const newName = editMenu.querySelector("#edit-name").value;
      const newDueDate = editMenu.querySelector("#edit-due-date").value
        ? `${editMenu.querySelector("#edit-due-date").value}T00:00`
        : null;
      const newContext = editMenu.querySelector("#edit-project").value;

      Context.modifyTask(task, {
        name: newName,
        dueDate: newDueDate,
        context: newContext,
      });

      checkbox.checked = false;
      const label = taskElement.querySelector("label");
      while (label.firstChild) {
        label.removeChild(label.firstChild);
      }
      label.append(document.createElement("span"));
      label.append(document.createTextNode(`${newName}`));
      dueDateSpan.textContent = lg.formatDueDate(newDueDate);
      projectName.textContent = newContext === "default" ? "" : newContext;

      const current = Context.getCurrent();
      if (current !== "default" && newContext !== current) taskElement.remove();
      closeEdit();
    };

    taskElement.append(editMenu);
  });

  deleteButton.addEventListener("click", () => {
    taskElement.remove();
    Context.deleteTask(task);
  });

  taskList.append(taskElement);
};

const setContext = (context) => {
  const isDefaultContext = context === "default";

  projectHeader.textContent = isDefaultContext ? "" : context;

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  const tasks = Context.set(context);
  toggleProjectMenu(false);

  // Update nav
  const contexts = Context.getContexts();
  while (nav.firstChild) {
    nav.removeChild(nav.firstChild);
  }
  contexts.forEach((contextName) => {
    const contextButton = lg.createContextButton(
      contextName,
      contextName === context
    );
    contextButton.addEventListener("click", () => {
      setContext(contextName);
    });

    nav.append(contextButton);
  });

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
  closeEdit();
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
    setContext(project);
    projectInput.value = "";
  });
  cancelButton.addEventListener("click", toggleProjectMenu);
});

setContext("default");
