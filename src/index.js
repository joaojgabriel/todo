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
        return Object.values(map[context]).concat();
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
  };
})();

const newTaskInput = document.querySelector("input#new-task");
const dueDateInput = document.querySelector("input#due-date");
const plusButton = document.querySelector("button#add-task");
const taskList = document.querySelector("ul#task-list");

const nav = document.querySelector("nav");
const inboxButton = document.querySelector("button#inbox");
const addProjectButton = document.querySelector("button#add-project");

const renderTask = (indexedTask) => {
  const newTaskElement = lg.createTaskElement(indexedTask);

  const newTaskCheckbox = newTaskElement.querySelector(
    'input[type="checkbox"]'
  );
  const newTaskEditButton = newTaskElement.querySelector(".edit");
  const newTaskDeleteButton = newTaskElement.querySelector(".delete");

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

const changeContext = (context) => {
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  const tasks = Context.change(context);
  if (!tasks) return;
  tasks.forEach((task) => renderTask(task));
};

plusButton.addEventListener("click", () => {
  const name = newTaskInput.value || null;
  if (!name) return;
  const dueDate = dueDateInput.value;
  const context = Context.getCurrent();

  const indexedTask = Context.indexTask({
    name,
    dueDate,
    context,
    completed: false,
  });
  Context.addTask(indexedTask);

  renderTask(indexedTask);
});

inboxButton.addEventListener("click", () => {
  changeContext("default");
});

addProjectButton.addEventListener("click", () => {});
