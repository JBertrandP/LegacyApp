import { LocalStorageTaskRepository } from "../storage/LocalStorageTaskRepository.js";
import { LocalAuthAdapter } from "../auth/LocalAuthAdapter.js";
import { TaskService } from "../../application/TaskService.js";

const taskRepo = new LocalStorageTaskRepository();
const authAdapter = new LocalAuthAdapter();
const taskService = new TaskService(taskRepo);

let currentUser = authAdapter.getCurrentUser();


function renderTasks(tasksToRender = taskService.getAllTasks()) {
    const tbody = document.getElementById('tasksTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    tasksToRender.forEach(task => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-size: 0.8rem; color: #888;">${task.id}</td>
            <td style="font-weight:bold; color:var(--p3-cyan)">${task.title}</td>
            <td><span class="badge">${task.status}</span></td>
            <td style="color:${task.priority === 'Crítica' ? '#ff0055' : 'white'}">${task.priority}</td>
            <td>${task.dueDate && task.dueDate !== "" ? task.dueDate : 'Sin fecha'}</td>
            <td>
                <button onclick="window.deleteTask('${task.id}')" class="delete-btn" style="padding:5px 10px;">
                    <span>ELIMINAR</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


window.handleLogin = () => {
    const userIn = document.getElementById('username').value;
    const passIn = document.getElementById('password').value;
    try {
        currentUser = authAdapter.login(userIn, passIn);
        renderApp();
    } catch (e) { alert("Error: " + e.message); }
};

window.handleLogout = () => {
    authAdapter.logout();
    currentUser = null;
    renderApp();
};

window.showTab = (tabName) => {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    const selected = document.getElementById(`tab-${tabName}`);
    if (selected) selected.style.display = 'block';
};

window.deleteTask = (id) => {
    taskService.deleteTask(id);
    renderTasks();
};

-
document.getElementById('task-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const titleValue = document.getElementById('taskTitle').value.trim();
    
    
    if (!titleValue) {
        alert("Por favor, añada un título a la tarea.");
        return;
    }

    const data = {
        title: titleValue,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value
    };
    
    taskService.createTask(data, currentUser.username);
    e.target.reset();
    renderTasks();
});

document.getElementById('search-input')?.addEventListener('input', (e) => {
    const filtered = taskService.searchTasks(e.target.value);
    renderTasks(filtered);
});

function renderApp() {
    if (currentUser) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
        document.getElementById('user-display').textContent = currentUser.username;
        renderTasks();
        window.showTab('tasks');
    } else {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('app-section').style.display = 'none';
    }
}

renderApp();