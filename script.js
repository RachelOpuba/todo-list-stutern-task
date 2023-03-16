const form = document.querySelector(".todo-form");
const todoInput = document.querySelector(".new-todo");
const todoElm = document.querySelector(".tasks");
const notification = document.querySelector(".notification");
//variables
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editTodoId = -1;

//first render
renderTodos();
form.addEventListener("submit", function (e) {
  e.preventDefault();
  //   ;
  saveTodo();
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
  setTimeout(function () {
    todoInput.value = "";
  }, 1000);
});

//SAVE TODO
function saveTodo() {
  const todoValue = todoInput.value;
  //check if the todo is empty
  const isEmpty = todoValue === "";
  //check for duplicate todos
  const isDuplicate = todos.some(function (todo) {
    return todo.value.toUpperCase() === todoValue.toUpperCase();
  });
  if (isEmpty) {
    showMessage("Todo input is empty");
  } else if (isDuplicate) {
    showMessage("todo already exist");
  } else if (editTodoId >= 0) {
    todos = todos.map(function (todo, index) {
      return {
        ...todo,
        value: index === editTodoId ? todoValue : todo.value,
      };
    });
    editTodoId = -1;
  } else {
    todos.unshift({
      value: todoValue,
    });
    todoInput.value = "";
  }
}

//RENDER TODOS
function renderTodos() {
  if (todos.length === 0) {
    todoElm.innerHTML = `<center class="nothing">Nothing to do</center>`;
    return;
  }
  //clear elements before a re-render

  todoElm.innerHTML = "";

  todos.forEach(function (todo, index) {
    console.log(todo.value);
    todoElm.innerHTML += `<div class="task">
              <div class="content " id=${index}>
                <p  class="text">${todo.value}  </p>
              </div>
              <div class="actions" id=${index}>
                <button data-action = "edit"class="edit btn">EDIT</button>
                <button data-action = "delete" class="delete btn">DELETE</button>
              </div>
            </div>`;
  });
}

//CLICK EVENT LISTENER FOR ALL THE TODOS
todoElm.addEventListener("click", function (e) {
  const target = e.target;
  let todoId = +target.parentElement.id;

  const action = target.dataset.action;

  action === "edit" && editTodo(todoId);
  action === "delete" && deletTodo(todoId);
});

function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  editTodoId = todoId;
}

function deletTodo(todoId) {
  todos = todos.filter(function (todo, index) {
    return index !== todoId;
  });

  editTodoId = -1;

  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showMessage(msg) {
  notification.innerHTML = msg;
  notification.classList.add("show-notification");
  setTimeout(function () {
    notification.classList.remove("show-notification");
  }, 1500);
}
