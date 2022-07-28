import '../styling/style.css';

// ---------- variables -----------

const todoList = document.querySelector('#todo-list');
const addTodoInput = document.querySelector('#add-todo-input');
const todoForm = document.querySelector('.form');

const listForm = document.querySelector('.list-form');
const addListInput = document.querySelector('#add-list-input');
const allLists = document.querySelector('.all-lists');

let currentList;

const allListsBtn = document.querySelector('.all-lists-btn');
const deleteListBtn = document.querySelector('.delete-list-btn');
const addListBtn = document.querySelector('.add-list-btn');
const addTodoBtn = document.querySelector('.add-todo-btn');

// ---------------------------------------

const todos = JSON.parse(localStorage.getItem('todos')) || [];
const lists = JSON.parse(localStorage.getItem('lists')) || [];

function addTodo() {
  if (addTodoInput.value.length > 0) {
    const todo = addTodoInput.value.trim();
    todos.push({
      text: todo,
      completed: false,
      list: currentList,
    });

    localStorage.setItem('todos', JSON.stringify(todos));
  }
  displayTodos(currentList);
  addTodoInput.value = '';
}

function remove(p) {
  const position = p;

  todos.splice(position, 1);
  removeLocalTodo(position);
  displayAllTodos();
}

// -------- event listeners ------------------

addTodoBtn.addEventListener('click', () => {
  console.log('clicked add todo');
});

addListBtn.addEventListener('click', () => {
  console.log('added new list');
  addList();
  addListInput.value = '';
});

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (currentList) {
    addTodo();
  } else {
    // addTodoInput.classList.toggle('error');
  }
});

allListsBtn.addEventListener('click', () => {
  currentList = '';

  localStorage.removeItem('current');

  displayAllTodos();

  allLists.textContent = '';

  if (lists.length) {
    for (let i = 0; i < lists.length; i++) {
      const newLI = document.createElement('li');
      newLI.classList.add('new-list-style');

      newLI.textContent = lists[i];

      newLI.addEventListener('click', (e) => {
        const siblings = e.target.parentNode.children;

        for (const sibling of siblings) {
          sibling.classList.remove('current');
        }
        currentList = e.target.textContent;
        e.target.classList.add('current');

        displayTodos(currentList);

        localStorage.removeItem('current');
      });

      allLists.append(newLI);

      newLI.classList.add('new-list-style');
      allLists.append(newLI);
    }
  }
});

document.addEventListener('DOMContentLoaded', displayLists);
document.addEventListener('DOMContentLoaded', displayTodos);

deleteListBtn.addEventListener('click', () => {
  if (currentList) {
    for (let i = 0; i < lists.length; i++) {
      if (lists[i] === currentList) {
        lists.splice(i, 1);
        localStorage.setItem('lists', JSON.stringify(lists));
      }
    }

    removeAllTodos(currentList);
    displayTodos(currentList);
    location.reload();
  }
});

// --------------------------------------------

function displayTodos(list) {
  list = currentList;
  todoList.textContent = '';

  if (todos.length) {
    for (let i = 0; i < todos.length; i++) {
      todos[i].id = i;

      if (todos[i].list === list) {
        const newLI = document.createElement('li');

        const newDiv = document.createElement('div');

        if (todos[i].completed === true) {
          newDiv.innerHTML += `<ion-icon
                      name="checkbox-outline"
                      class="completed"></ion-icon>`;
        } else {
          newDiv.innerHTML += '<ion-icon name="square-outline" class="uncompleted"></ion-icon>';
        }

        newDiv.classList.add('flex-container');

        const newSpan = document.createElement('span');

        newSpan.textContent = todos[i].text;

        newDiv.append(newSpan);

        newDiv.innerHTML += '<ion-icon name="close-outline" class="close-outline"></ion-icon>';

        newLI.append(newDiv);

        todoList.append(newLI);

        newDiv.addEventListener('click', (e) => {
          if (e.target.classList.contains('close-outline')) {
            remove(todos[i].id);
            e.target.parentNode.remove();
          } else if (e.target.classList.contains('uncompleted')) {
            e.target.outerHTML = `<ion-icon
                          name="checkbox-outline"
                          class="completed"></ion-icon>`;

            todos[i].completed = true;

            localStorage.setItem('todos', JSON.stringify(todos));
          } else if (e.target.classList.contains('completed')) {
            e.target.outerHTML = '<ion-icon name="square-outline" class="uncompleted"></ion-icon>';

            todos[i].completed = false;

            localStorage.setItem('todos', JSON.stringify(todos));
          }
        });
      }
    }
  }
}

function removeLocalTodo(todo) {
  let todos;

  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }

  const todoIndex = todo;
  todos.splice(todoIndex, 1);

  localStorage.setItem('todos', JSON.stringify(todos));
}

function removeAllTodos(list) {
  let todos;

  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }

  for (let i = todos.length - 1; i >= 0; i--) {
    if (todos[i].list === list) {
      todos.splice(i, 1);
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }

  displayTodos(currentList);
}

function displayLists() {
  allLists.textContent = '';

  if (lists.length) {
    for (let i = 0; i < lists.length; i++) {
      const newLI = document.createElement('li');

      newLI.classList.add('new-list-style');

      newLI.textContent = lists[i];

      if (lists.length === 1) {
        newLI.classList.add('current');

        currentList = newLI.textContent;
        displayTodos(currentList);
      } else if (lists[i] === lists[lists.length - 1]) {
        newLI.classList.add('current');
        currentList = newLI.textContent;

        localStorage.setItem('current', JSON.stringify(currentList));
      }

      newLI.addEventListener('click', (e) => {
        const siblings = e.target.parentNode.children;

        for (const sibling of siblings) {
          sibling.classList.remove('current');
        }
        currentList = e.target.textContent;
        e.target.classList.add('current');

        displayTodos(currentList);

        localStorage.setItem('current', JSON.stringify(currentList));
      });

      allLists.append(newLI);

      newLI.classList.add('new-list-style');
      allLists.append(newLI);
    }
  }
}

function addList() {
  if (addListInput.value.length > 0) {
    const list = addListInput.value.trim();
    lists.push(list);

    localStorage.setItem('lists', JSON.stringify(lists));
  }

  currentList = addListInput.value;

  displayLists();
  displayTodos(currentList);

  addListInput.value = '';
}

listForm.addEventListener('submit', (e) => {
  e.preventDefault();

  addList();
  addListInput.value = '';
});

function displayAllTodos() {
  todoList.textContent = '';

  todoList.textContent = '';

  if (todos.length) {
    for (let i = 0; i < todos.length; i++) {
      todos[i].id = i;

      const newLI = document.createElement('li');

      const newDiv = document.createElement('div');

      if (todos[i].completed === true) {
        newDiv.innerHTML += `<ion-icon
                      name="checkbox-outline"
                      class="completed"></ion-icon>`;
      } else {
        newDiv.innerHTML += '<ion-icon name="square-outline" class="uncompleted"></ion-icon>';
      }

      newDiv.classList.add('flex-container');

      const newSpan = document.createElement('span');

      newSpan.textContent = todos[i].text;

      newDiv.append(newSpan);

      newDiv.innerHTML += '<ion-icon name="close-outline" class="close-outline"></ion-icon>';

      newLI.append(newDiv);

      todoList.append(newLI);

      newDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-outline')) {
          remove(todos[i].id);
          e.target.parentNode.remove();
        } else if (e.target.classList.contains('uncompleted')) {
          e.target.outerHTML = `<ion-icon
                          name="checkbox-outline"
                          class="completed"></ion-icon>`;

          todos[i].completed = true;

          localStorage.setItem('todos', JSON.stringify(todos));
        } else if (e.target.classList.contains('completed')) {
          e.target.outerHTML = '<ion-icon name="square-outline" class="uncompleted"></ion-icon>';

          todos[i].completed = false;

          localStorage.setItem('todos', JSON.stringify(todos));
        }
      });
    }
  }
}
