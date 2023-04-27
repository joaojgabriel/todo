import { intlFormatDistance } from "date-fns/fp";

export function createElement(innerHTML) {
  const placeholder = document.createElement("div");
  placeholder.innerHTML = innerHTML;

  return placeholder.firstElementChild;
}

const formatDate = (date) => {
  if (!date) return false;

  return intlFormatDistance(new Date())(date);
};

export function createTaskElement({
  name,
  dueDate,
  completed,
  context,
  index,
}) {
  const innerHTML = `
    <li id="task-${index}" class="task ${completed ? "completed" : ""}">
      <label for="checkbox-${index}">
        <input type="checkbox" ${
          completed ? "checked" : ""
        } id="checkbox-${index}"/>
        ${name}
      </label>
      <div>
        <span class="due-date">${formatDate(dueDate) || "No due date"}</span>
        <span class="project-name">${
          context === "default" ? "" : context
        }</span>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    </li>`;

  return createElement(innerHTML);
}

export function createEditMenu({ name, dueDate, context, index }) {
  const innerHTML = `<form data-index="${index}" class="edit">
    <label for="edit-name"
      >Change task<input id="edit-name" type="text" value="${name}"
    /></label>
    <label for="edit-due-date"
      >Change date<input id="edit-due-date" type="date" value="${dueDate || ""}"
    /></label>
    <label for="edit-project">Select project</label>
    <select id="edit-project" />
      <option value="${context === "default" ? "None" : context}">${
    context === "default" ? "None" : context
  }</option>
    </select>
    <input type="submit" value="Confirm">
    <button class="cancel-edit">Cancel</button>
  </form>`;

  return createElement(innerHTML);
}

export function createProjectButton(name) {
  const innerHTML = `
    <button class="project-button">
      ${name}
    </button>`;

  return createElement(innerHTML);
}

export function createProjectHeader(name) {
  const innerHTML = `
    <h2 class="project-header">
      ${name}
    </h2>
  `;

  return createElement(innerHTML);
}
