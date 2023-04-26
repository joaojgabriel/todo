import "./style.css";

const createElement = (innerHTML) => {
  const placeholder = document.createElement("div");
  placeholder.innerHTML = innerHTML;

  return placeholder.firstElementChild;
};

const createTaskObject = (input, context) => ({
  name: input,
  dueDate: null,
  completed: false,
  project: context,
});

const createTaskElement = ({ name, dueDate, completed, project }) => {
  const innerHTML = `
    <li class="task ${completed}">
      <label for="${name}">
        <input type="checkbox" id="${name}" />
        ${name}
      </label>
      <span class="due-date"${dueDate}<span>
      <span class="project">${project === "default" ? "" : project}</span>
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </li>`;
  
  return createElement(innerHTML);
};
