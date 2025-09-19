document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dueDateInput = document.getElementById('due-date-input');
    const todoList = document.getElementById('todo-list');
    const noTaskMsg = document.getElementById('no-task-msg');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const filterBtn = document.getElementById('filter-btn');

    let isFiltered = false;

    // Load todos from local storage
    const getTodos = () => {
        return JSON.parse(localStorage.getItem('todos')) || [];
    };

    // Save todos to local storage
    const saveTodos = (todos) => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // Render todos to the list
    const renderTodos = () => {
        const todos = getTodos();
        todoList.innerHTML = '';

        const todosToRender = isFiltered ? todos.filter(todo => !todo.completed) : todos;

        if (todosToRender.length > 0) {
            noTaskMsg.style.display = 'none';
        } else {
            noTaskMsg.style.display = 'block';
            noTaskMsg.textContent = isFiltered ? 'No active tasks found' : 'No task found';
        }

        todosToRender.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            li.dataset.index = index;

            // Format date to be more readable
            const date = new Date(todo.dueDate);
            const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'});

            li.innerHTML = `
                <span class="task-text">${todo.text}</span>
                <span>${formattedDate}</span>
                <button class="status-btn">${todo.completed ? 'Completed' : 'Pending'}</button>
                <button class="delete-btn">🗑️</button>
            `;
            todoList.appendChild(li);
        });
    };

    // Add a new todo
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTodoText = todoInput.value.trim();
        const newDueDate = dueDateInput.value;

        if (newTodoText === '' || newDueDate === '') {
            alert('Please fill in both the task and the due date.'); // Input validation
            return;
        }

        const todos = getTodos();
        todos.push({ text: newTodoText, dueDate: newDueDate, completed: false });
        saveTodos(todos);
        renderTodos();
        todoForm.reset();
    });

    // Handle clicks on the list (for deleting or marking as complete)
    todoList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;

        const index = parseInt(li.dataset.index, 10);
        let todos = getTodos();
        
        // Find the actual index in the original array
        const originalIndex = todos.findIndex(todo => todo.text === li.querySelector('.task-text').textContent && todo.dueDate === getTodos()[index].dueDate);

        if (e.target.classList.contains('delete-btn')) {
            todos.splice(originalIndex, 1);
        }

        if (e.target.classList.contains('status-btn')) {
            todos[originalIndex].completed = !todos[originalIndex].completed;
        }

        saveTodos(todos);
        renderTodos();
    });

    // Delete all todos
    deleteAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            saveTodos([]);
            renderTodos();
        }
    });

    // Filter incomplete todos
    filterBtn.addEventListener('click', () => {
        isFiltered = !isFiltered;
        if (isFiltered) {
            filterBtn.textContent = 'SHOW ALL';
            filterBtn.style.backgroundColor = '#27ae60';
        } else {
            filterBtn.textContent = 'FILTER';
            filterBtn.style.backgroundColor = '#34495e';
        }
        renderTodos();
    });

    // Initial render
    renderTodos();
});