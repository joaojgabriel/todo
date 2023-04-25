import "./style.css";
import Context, { runContext } from "./Context";

// When user clicks Inbox, show all tasks
(() => {
  const inboxButton = document.querySelector("button#inbox");
  inboxButton.addEventListener("click", () => {
    runContext("default");
  });
})();

// When user clicks + Add Project, create and run new context
(() => {
  const addProjectButton = document.querySelector("button#add-project");
  addProjectButton.addEventListener("click", () => {
    const aside = document.querySelector("aside");

    // Hide Button and create a small context menu for naming the project
    addProjectButton.classList.add("hidden");

    const container = document.createElement("div");

    container.innerHTML = `
      <label for="new-project" class="new-project">
        Name your project
      </label>
      <input id="new-project" type="text" placeholder="My Project" class="new-project">
      <button class="new-project">Add</button>
      <button class="new-project">Cancel</button>
    `;

    const [label, input, addButton, cancelButton] = container.children;

    const closeNewProjectPrompt = () => {
      [...document.querySelectorAll(".new-project")].forEach((element) =>
        element.remove()
      );
      addProjectButton.classList.remove("hidden");
    };

    // When user clicks Cancel, close menu
    cancelButton.addEventListener("click", () => {
      closeNewProjectPrompt();
      aside.classList.remove("invalid");
    });

    // When user clicks Add
    addButton.addEventListener("click", () => {
      const newProjectName = input.value;
      const nav = document.querySelector("aside > nav");

      // Check if there is text in the input field and the project name is valid
      if (!newProjectName) return;
      if (Context.isAContext(newProjectName) || newProjectName === "default") {
        aside.classList.add("invalid");
        return;
      }

      // Reset values
      input.value = "";
      aside.classList.remove("invalid");

      // Close menu and run context
      closeNewProjectPrompt();
      runContext(newProjectName);

      // Add project button to nav
      const projectLink = document.createElement("button");
      projectLink.textContent = newProjectName;
      nav.append(projectLink);

      // Change context when clicking button
      projectLink.addEventListener("click", () => {
        runContext(newProjectName);
      });
    });

    aside.append(...container.children);
  });
})();

runContext("default");
