import { formatDistanceToNow } from "date-fns";

const formatDate = (date) => {
  if (!date) return false;

  return formatDistanceToNow(date, { addSuffix: true });
};

export function createTaskElement({
  name,
  dueDate,
  completed,
  context,
  index,
}) {
  const li = document.createElement("li");
  li.id = `task-${index}`;
  li.className = `task ${completed ? "completed" : ""}`;

  const label = document.createElement("label");
  label.htmlFor = `checkbox-${index}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `checkbox-${index}`;
  checkbox.checked = completed;

  const span = document.createElement("span");
  span.textContent = name;

  label.appendChild(checkbox);
  label.appendChild(span);

  const div = document.createElement("div");

  const dueDateSpan = document.createElement("span");
  dueDateSpan.className = "due-date";
  dueDateSpan.textContent = formatDate(dueDate) || "No due date";

  const contextSpan = document.createElement("span");
  contextSpan.className = "project-name";
  contextSpan.textContent = context === "default" ? "" : context;

  const editButton = document.createElement("button");
  editButton.className = "edit";
  editButton.textContent = "Edit";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.textContent = "Delete";

  div.appendChild(dueDateSpan);
  div.appendChild(contextSpan);
  div.appendChild(editButton);
  div.appendChild(deleteButton);

  li.appendChild(label);
  li.appendChild(div);

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
