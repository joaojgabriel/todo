import "./style.css";
import * as lg from "./Logic";

const Context = (() => {
  let current = "default";
  const map = { default: [] };
  return {
    getCurrent() {
      return current;
    },
    change(context) {
      current = context;
    },
    addTask(taskObject) {
      map[current].push(taskObject);
    },
    modifyTask({ name, context }, changeObject) {
      // This has an inherent bug: tasks with the same
      // name and context are all modified
      map[context].forEach((task) => {
        if (task.name === name) {
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

plusButton.addEventListener("click", () => {
  const name = newTaskInput.value || null;
  if (!name) return;
  const dueDate = dueDateInput.value;
  const context = Context.getCurrent();

  const newTaskObject = { name, dueDate, context, completed: false };
  Context.addTask(newTaskObject);
  const newTaskElement = lg.createTaskElement(newTaskObject);

  const newTaskCheckbox = newTaskElement.querySelector(`#${name}-checkbox`);
  // const newTaskEditButton = newTaskElement.querySelector('.edit')
  // const newTask
  newTaskCheckbox.addEventListener("change", () => {
    newTaskElement.classList.toggle("completed");
    Context.modifyTask(newTaskObject, { completed: newTaskCheckbox.checked });
  });


  taskList.append(newTaskElement);
});

inboxButton.addEventListener("click", () => {});

addProjectButton.addEventListener("click", () => {});
