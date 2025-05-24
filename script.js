// DOM Elements
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date');
const prioritySelect = document.getElementById('priority-select');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('theme-toggle');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');

// State
let tasks = [];
let currentFilter = 'all';
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Check Authentication
if (!currentUser) {
    window.location.href = 'login.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateTheme();
    updateUserName();
});

// Update User Name
function updateUserName() {
    if (currentUser) {
        userName.textContent = `Welcome, ${currentUser.name}`;
    }
}

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    updateTheme();
});

function updateTheme() {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Task Management
function addTask() {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value;

    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            dueDate,
            priority,
            createdAt: new Date().toISOString(),
            userId: currentUser.email
        };

        tasks.push(task);
        saveTasks();
        renderTasks();
        clearInputs();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

function editTask(id, newText) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, text: newText };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Filter Tasks
function filterTasks(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderTasks();
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = '';
    
    const userTasks = tasks.filter(task => task.userId === currentUser.email);
    const filteredTasks = userTasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'pending') return !task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const content = document.createElement('div');
    content.className = 'task-content';

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const dueDate = document.createElement('span');
    dueDate.className = 'task-due-date';
    if (task.dueDate) {
        dueDate.textContent = `Due: ${new Date(task.dueDate).toLocaleDateString()}`;
    }

    const priority = document.createElement('span');
    priority.className = `task-priority priority-${task.priority}`;
    priority.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', () => {
        const newText = prompt('Edit task:', task.text);
        if (newText && newText.trim()) {
            editTask(task.id, newText.trim());
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    content.appendChild(text);
    content.appendChild(dueDate);
    content.appendChild(priority);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(actions);

    return li;
}

// Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterTasks(btn.dataset.filter);
    });
});

// Clear Inputs
function clearInputs() {
    taskInput.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'low';
    taskInput.focus();
} 