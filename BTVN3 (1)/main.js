const todoInput = document.querySelector('#todoInput');
const saveBtn = document.querySelector('#saveBtn');
const todoListElement = document.querySelector('#todoList');
let isEdit = '';

// todo object { id, todo }
const todoArr = localStorage.getItem('todoList') ? JSON.parse(localStorage.getItem('todoList')) : [];

for (const todo of todoArr) {
    const todoElement = handleBuildTodo(todo);

    todoListElement.appendChild(todoElement);
}


saveBtn.addEventListener('click', handleAddTodo);

function handleSetLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoArr));
}

function handleAddTodo() {
    const newTodo = todoInput.value;

    if (!newTodo) return;

    if (isEdit) {
        // handle edit
        const todoIndex = todoArr.findIndex((element) => {
            return element.id === isEdit;
        })


        if (todoIndex > -1) {
            todoArr[todoIndex].todo = newTodo;
            console.log(todoArr[todoIndex])
            handleSetLocalStorage();
        }

        getOrSetEditElement('GET', isEdit, newTodo);

        return;
    }

    const randomId = 'id-' + Math.ceil(Math.random() * 9999999);

    const objectTodo = {
        id: randomId,
        todo: newTodo
    }

    todoArr.push(objectTodo);
    // set gia tri localstorage
    handleSetLocalStorage();

    // them todo vao html
    const todoElement = handleBuildTodo(objectTodo);

    todoListElement.appendChild(todoElement);

    todoInput.value = '';
}

function handleRemoveTodo(id) {
    const todoElement = document.querySelector(`#${id}`);
    todoListElement.removeChild(todoElement);
    const todoIndex = todoArr.findIndex((element) => {
        return element.id === id;
    })

    if (todoIndex > -1) {
        todoArr.splice(todoIndex, 1);
        handleSetLocalStorage();
    }
}

function handleEditTodo(id) {
    getOrSetEditElement('SET', id)
}

function getOrSetEditElement(type, todoId, newValue) {
    const todoElement = document.querySelector(`#${todoId}`);
    const todoLabel = todoElement.querySelector('.todo-label');

    if (type === 'SET') {
        todoInput.value = todoLabel.innerText;
        saveBtn.innerText = 'Edit';
        isEdit = todoId;
        return;
    }

    todoLabel.innerText = newValue;
    todoInput.value = '';
    isEdit = '';
    saveBtn.innerText = 'Add';
}

function handleBuildTodo(todoObject) {
    const newTodo = todoObject.todo;

    const randomId = todoObject.id

    // them todo vao html
    const todoTemplate = document.querySelector('#todoTemplate');
    const todoFragment = todoTemplate.content.cloneNode(true);
    const todoElement = todoFragment.querySelector('.todo-element');

    // set todo Id6
    todoElement.setAttribute('id', randomId);

    // todo label
    const todoLabelElement = todoElement.querySelector('.todo-label');
    todoLabelElement.innerText = newTodo;

    // remove btn
    const removeTodoBtnElement = todoElement.querySelector('.remove-todo-btn');
    removeTodoBtnElement.addEventListener('click', function (event) {
        event.preventDefault();
        handleRemoveTodo(randomId);
    })

    // edit btn
    const editTodoBtnElement = todoElement.querySelector('.edit-todo-btn');
    editTodoBtnElement.addEventListener('click', function (event) {
        event.preventDefault();
        handleEditTodo(randomId);
    })

    return todoElement
}