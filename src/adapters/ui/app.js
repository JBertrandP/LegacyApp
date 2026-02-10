import { LocalStorageTaskRepository } from "../storage/LocalStorageTaskRepository.js";
import { LocalAuthAdapter } from "../auth/LocalAuthAdapter.js";
import { TaskService } from "../../application/TaskService.js";

// Inicialización
const taskRepo = new LocalStorageTaskRepository();
const authAdapter = new LocalAuthAdapter();
const taskService = new TaskService(taskRepo);

let currentUser = authAdapter.getCurrentUser();

// Referencias DOM
const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const taskList = document.getElementById('task-list');

// --- LÓGICA DE UI ---

function renderApp() {
    if (currentUser) {
        loginSection.style.display = 'none';
        appSection.style.display = 'block';
        document.getElementById('user-display').textContent = currentUser.username;
        renderTasks();
        // Mostrar tab de tareas por defecto
        window.showTab('tasks');
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
            <span>${task.title} <small style="color: var(--p3-cyan);">(${task.createdBy})</small></span>
            <div>
                <button onclick="window.toggleTask('${task.id}')">
                    <span>${task.status === 'completed' ? 'Retomar' : 'Completar'}</span>
                </button>
                <button onclick="window.deleteTask('${task.id}')" class="delete-btn">
                    <span>Eliminar</span>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// --- FUNCIONES GLOBALES (Window) ---

window.handleLogin = () => {
    const userIn = document.getElementById('username').value;
    const passIn = document.getElementById('password').value;
    try {
        currentUser = authAdapter.login(userIn, passIn);
        renderApp();
    } catch (e) {
        alert("Acceso Denegado: " + e.message);
    }
};

window.handleLogout = () => {
    authAdapter.logout();
    currentUser = null;
    renderApp();
};

window.showTab = (tabName) => {
    // 1. Ocultar todas las tabs
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    
    // 2. Mostrar la seleccionada
    const selected = document.getElementById(`tab-${tabName}`);
    if (selected) selected.style.display = 'block';
};

window.toggleTask = (id) => {
    taskService.toggleTaskStatus(id);
    renderTasks();
};

window.deleteTask = (id) => {
    taskService.deleteTask(id);
    renderTasks();
};

// Event Listener para el Formulario de Tareas
document.getElementById('task-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    
    if(title && desc) {
        taskService.createTask(title, desc, currentUser.username);
        document.getElementById('task-title').value = '';
        document.getElementById('task-desc').value = '';
        renderTasks();
    }
});

// Arrancar
renderApp();