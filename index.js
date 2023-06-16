import {v4 as uuidv4} from "../_snowpack/pkg/uuid.js";
const list = document.querySelector("#task-list");
const listNoElementsInfo = document.querySelector("#task-list-info");
const form = document.querySelector("#new-task-form");
const modalClose = document.querySelector(".modal-close");
const inputTitle = document.querySelector("#new-task-title");
const inputDesc = document.querySelector("#new-task-desc");
const inputDate = document.querySelector("#new-task-date");
const openModalBtn = document.querySelector(".main-button");
const modal = document.querySelector(".modal");
const tasks = loadTasks();
tasks.forEach(addListItem);
if (tasks.length !== 0 && listNoElementsInfo) {
  listNoElementsInfo?.remove();
}
window.onclick = function(event) {
  if (modal == null)
    return;
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
openModalBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  if (modal == null)
    return;
  modal.style.display = "block";
});
modalClose?.addEventListener("click", (e) => {
  e.preventDefault();
  if (modal == null)
    return;
  modal.style.display = "none";
});
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputTitle?.value == "" || inputTitle?.value == null || inputDesc?.value == null || inputDate?.value == null || !inputDate?.value)
    return;
  const newTask = {
    id: uuidv4(),
    title: inputTitle.value,
    desc: inputDesc.value,
    completed: false,
    createdAt: new Date(),
    deadline: inputDate.value
  };
  tasks.push(newTask);
  addListItem(newTask);
  inputTitle.value = "";
  inputDesc.value = "";
  if (tasks.length !== 0 && listNoElementsInfo) {
    listNoElementsInfo?.classList.add("hidden");
  }
});
function addListItem(task) {
  const taskListTaskContiner = document.createElement("li");
  const currentDay = new Date();
  const deadlineDate = new Date(task.deadline);
  taskListTaskContiner.innerHTML = `<div class="task-list-task-continer ${deadlineDate <= currentDay && "delayed"} ${task.completed && "checked"} ">
          <div class="task-list-task-checkbox-wrapper">
            <input type="checkbox" class="tast-list-task-checkbox " id="checkbox-${task.id}" ${task.completed && "checked"}/>
          </div>
          <div class="task-list-task-content-wrapper">
            <div class="task-list-task-title-wrapper">
            <div class = "task-list-title-calendar-wrapper">
              <p class="task-list-task-title">${task.title}</p>
              <input type="date" class="task-date" id="task-date-${task.id}" value="${task.deadline}"/>
</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-lg"
                id = "delete-task-${task.id}"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
                />
              </svg>
            </div>
            <div class="task-list-task-desc-wrapper">
              <p class="task-list-task-desc">${task.desc}</p>
            </div>
          </div>
        </div>`;
  saveTasks();
  list?.append(taskListTaskContiner);
  const deleteButton = document.querySelector(`#delete-task-${task.id}`);
  deleteButton?.addEventListener("click", (e) => {
    e.preventDefault();
    deleteButton.parentElement?.parentElement?.parentElement?.parentElement?.remove();
    const index = arrayRemove(task.id);
    tasks.splice(index, 1);
    saveTasks();
    if (tasks.length == 0 && listNoElementsInfo) {
      listNoElementsInfo?.classList.remove("hidden");
    }
  });
  const checkBox = document.querySelector(`#checkbox-${task.id}`);
  checkBox?.addEventListener("change", (e) => {
    if (checkBox == null)
      return;
    const wrapper = checkBox.parentElement?.parentElement;
    if (checkBox.checked) {
      wrapper?.classList.add("checked");
      task.completed = true;
    } else {
      wrapper?.classList.remove("checked");
      task.completed = false;
    }
    saveTasks();
  });
  const calendar = document.querySelector(`#task-date-${task.id}`);
  calendar?.addEventListener("change", (e) => {
    console.log("zmieniono date");
    task.deadline = calendar.value;
    const wrapper = calendar.parentElement?.parentElement?.parentElement?.parentElement;
    if (currentDay >= new Date(task.deadline)) {
      wrapper?.classList.add("delayed");
    } else {
      wrapper?.classList.remove("delayed");
    }
    saveTasks();
  });
  if (modal == null)
    return;
  modal.style.display = "none";
}
function arrayRemove(id) {
  tasks.forEach((element, index) => {
    if (element.id == id)
      return index;
  });
  return 0;
}
function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}
function loadTasks() {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null)
    return [];
  return JSON.parse(taskJSON);
}
