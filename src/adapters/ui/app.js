import { LocalStorageTaskRepository } from "../storage/LocalStorageTaskRepository.js";
import { LocalAuthAdapter } from "../auth/LocalAuthAdapter.js";
import { TaskService } from "../../application/TaskService.js";

// Initialize Dependencies
const taskRepo = new LocalStorageTaskRepository();
const authAdapter = new LocalAuthAdapter();
const taskService = new TaskService(taskRepo);

// UI State
let currentUser = authAdapter.getCurrentUser();

// DOM References
const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Render Functions
function renderApp() {
    if (currentUser) {
        loginSection.style.display = 'none';
        appSection.style.display = 'block';
        document.getElementById('user-display').textContent = `Hola, ${currentUser.username}`;
        renderTasks();
    } else {
        loginSection.style.display = 'block';
        appSection.style.display = 'none';
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    const tasks = taskService.getAllTasks();
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.status === 'completed' ? 'completed' : '';
        li.innerHTML = `
            <span>${task.title} - <small>${task.createdBy}</small></span>
            <div>
           <button onclick="window.toggleTask('${task.id}')">
           <span>${task.status === 'completed' ? 'Desmarcar' : 'Completar'}</span>
           </button>
           <button onclick="window.deleteTask('${task.id}')" class="delete-btn">
           <span>Eliminar</span>
           </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Event Listeners
loginBtn.addEventListener('click', () => {
    try {
        const user = authAdapter.login(usernameInput.value, passwordInput.value);
        currentUser = user;
        renderApp();
    } catch (error) {
        alert(error.message);
    }
});

logoutBtn.addEventListener('click', () => {
    authAdapter.logout();
    currentUser = null;
    renderApp();
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    
    taskService.createTask(title, desc, currentUser.username);
    
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    renderTasks();
});

// Expose Global Functions for HTML onclick buttons
window.toggleTask = (id) => {
    taskService.toggleTaskStatus(id);
    renderTasks();
};

window.deleteTask = (id) => {
    taskService.deleteTask(id);
    renderTasks();
};

renderApp();