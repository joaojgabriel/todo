import "./style.css";

const createTaskObject = (input, context) => ({
  name: input,
  dueDate: null,
  completed: false,
  project: context,
});
