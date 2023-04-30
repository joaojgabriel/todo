import { intlFormatDistance, isBefore, parseISO } from "date-fns";

export function formatDueDate(date) {
  if (!date) return "No due date";

  const dateObj = parseISO(date);
  const now = new Date();
  const text = isBefore(dateObj, now) ? "Overdue since " : "Due ";

  return text + intlFormatDistance(dateObj, now);
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
  dueDateSpan.textContent = formatDueDate(dueDate);

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

  const taskDiv = document.createElement("div");
  taskDiv.className = "task-container";
  taskDiv.appendChild(leftSide);
  taskDiv.appendChild(rightSide);

  li.appendChild(taskDiv);

  return li;
}

const createProjectOption = (project) => {
  const projectOption = document.createElement("option");
  if (project === "default") {
    projectOption.setAttribute("value", "default");
    projectOption.textContent = "None";
  } else {
    projectOption.setAttribute("value", project);
    projectOption.textContent = project;
  }
  return projectOption;
};

export function createEditMenu({ name, dueDate, context, index }, projects) {
  const form = document.createElement("form");
  form.setAttribute("data-index", index);
  form.className = "edit-menu";

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
  if (dueDate) dateInput.setAttribute("value", dueDate.slice(0, -6));
  dateLabel.appendChild(dateInput);

  const projectLabel = document.createElement("label");
  projectLabel.setAttribute("for", "edit-project");
  projectLabel.textContent = "Select project";
  form.appendChild(projectLabel);

  const projectSelect = document.createElement("select");
  projectSelect.setAttribute("id", "edit-project");
  form.appendChild(projectSelect);

  projectSelect.append(createProjectOption(context));

  projects.forEach((project) => {
    if (project !== context) {
      projectSelect.append(createProjectOption(project));
    }
  });

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

export function createContextButton(context, isCurrent) {
  const button = document.createElement("button");
  button.classList.add("project-button");
  button.textContent = context === "default" ? "Inbox" : context;
  if (isCurrent) button.classList.add("current-context");

  return button;
}

export function createProjectHeader(name) {
  const header = document.createElement("h2");
  header.classList.add("project-header");
  header.textContent = name;

  return header;
}
