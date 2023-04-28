import { intlFormatDistance, parseISO } from "date-fns";

export function setDueDate(element, date) {
  // eslint-disable-next-line no-param-reassign
  element.textContent = date
    ? `Due ${intlFormatDistance(parseISO(date), new Date())}`
    : "No due date";
}

export function createTaskElement({
  name,
  dueDate,
  completed,
  context,
  index,
}) {
  const li = document.createElement("li");
  li.setAttribute("data-index", `${index}`);
  li.className = `task ${completed ? "completed" : ""}`;

  const leftSide = document.createElement("div");
  leftSide.className = "left";

  const checkbox = document.createElement("input");
  checkbox.className = "checkbox";
  checkbox.type = "checkbox";
  checkbox.id = `checkbox-${index}`;
  checkbox.checked = completed;

  const label = document.createElement("label");
  label.htmlFor = `checkbox-${index}`;
  label.texContext = name;
  label.className = "task-label";

  label.append(document.createElement("span"));
  label.append(document.createTextNode(`${name}`));

  const rightSide = document.createElement("div");
  rightSide.className = "right";

  const contextSpan = document.createElement("span");
  contextSpan.className = "project-name";
  contextSpan.textContent = context === "default" ? "" : context;

  const dueDateSpan = document.createElement("span");
  dueDateSpan.className = "due-date";
  setDueDate(dueDateSpan, dueDate);

  const editButton = document.createElement("button");
  editButton.className = "edit";
  editButton.textContent = "Edit";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.textContent = "Delete";

  leftSide.append(checkbox);
  leftSide.appendChild(label);

  rightSide.appendChild(contextSpan);
  rightSide.appendChild(dueDateSpan);
  rightSide.appendChild(editButton);
  rightSide.appendChild(deleteButton);

  li.appendChild(leftSide);
  li.appendChild(rightSide);

  return li;
}

export function createEditMenu({ name, dueDate, context, index }) {
  const form = document.createElement("form");
  form.setAttribute("data-index", index);
  form.classList.add("edit");

  const nameLabel = document.createElement("label");
  nameLabel.setAttribute("for", "edit-name");
  nameLabel.textContent = "Change task";
  form.appendChild(nameLabel);

  const nameInput = document.createElement("input");
  nameInput.setAttribute("id", "edit-name");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("value", name);
  nameLabel.appendChild(nameInput);

  const dateLabel = document.createElement("label");
  dateLabel.setAttribute("for", "edit-due-date");
  dateLabel.textContent = "Change date";
  form.appendChild(dateLabel);

  const dateInput = document.createElement("input");
  dateInput.setAttribute("id", "edit-due-date");
  dateInput.setAttribute("type", "date");
  dateInput.setAttribute("value", dueDate || "");
  dateLabel.appendChild(dateInput);

  const projectLabel = document.createElement("label");
  projectLabel.setAttribute("for", "edit-project");
  projectLabel.textContent = "Select project";
  form.appendChild(projectLabel);

  const projectSelect = document.createElement("select");
  projectSelect.setAttribute("id", "edit-project");
  form.appendChild(projectSelect);

  const noneOption = document.createElement("option");
  noneOption.setAttribute("value", "None");
  noneOption.textContent = "None";
  projectSelect.appendChild(noneOption);

  if (context !== "default") {
    const contextOption = document.createElement("option");
    contextOption.setAttribute("value", context);
    contextOption.textContent = context;
    projectSelect.appendChild(contextOption);
  }

  const submitInput = document.createElement("input");
  submitInput.setAttribute("type", "submit");
  submitInput.setAttribute("value", "Confirm");
  form.appendChild(submitInput);

  const cancelBtn = document.createElement("button");
  cancelBtn.classList.add("cancel-edit");
  cancelBtn.textContent = "Cancel";
  form.appendChild(cancelBtn);

  return form;
}

export function createProjectButton(name) {
  const button = document.createElement("button");
  button.classList.add("project-button");
  button.textContent = name;

  return button;
}

export function createProjectHeader(name) {
  const header = document.createElement("h2");
  header.classList.add("project-header");
  header.textContent = name;

  return header;
}
