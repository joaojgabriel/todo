import "./style.css";

const createElement = (innerHTML) => {
  const placeholder = document.createElement("div");
  placeholder.innerHTML = innerHTML;

  return placeholder.firstElementChild;
};

const createTaskObject = (name, dueDate, context) => ({
  name,
  dueDate,
  context,
  completed: false,
});

const createTaskElement = ({ name, dueDate, completed, context }) => {
  const innerHTML = `
    <li class="task ${completed}">
      <label for="${name}">
        <input type="checkbox" id="${name}" />
        ${name}
      </label>
      <span class="due-date">${dueDate}</span>
      <span class="project">${context === "default" ? "" : context}</span>
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </li>`;
  return createElement(innerHTML);
};
