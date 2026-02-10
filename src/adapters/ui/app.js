import { LocalStorageTaskRepository } from "../storage/LocalStorageTaskRepository.js";
import { LocalAuthAdapter } from "../auth/LocalAuthAdapter.js";
import { TaskService } from "../../application/TaskService.js";


const taskRepo = new LocalStorageTaskRepository();
const authAdapter = new LocalAuthAdapter();
const taskService = new TaskService(taskRepo);

let currentUser = authAdapter.getCurrentUser();


const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const taskList = document.getElementById('task-list');



function renderApp() {
    if (currentUser) {
        loginSection.style.display = 'none';
        appSection.style.display = 'block';
        document.getElementById('user-display').textContent = currentUser.username;
        renderTasks();
        
        window.showTab('tasks');
    } else {
        loginSection.style.display = 'block';
        appSection.style.display = 'none';
    }
}


function renderTasks(tasksToRender = taskService.getAllTasks()) {
    const tbody = document.getElementById('task-list-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    tasksToRender.forEach(task => {
        const tr = document.createElement('tr');
        // IMPORTANTE: Verifica que los nombres (task.title, task.status, etc.) 
        // coincidan exactamente con tu clase Task en Domain.
        tr.innerHTML = `
            <td style="font-weight:bold">${task.title}</td>
            <td><span class="badge">${task.status}</span></td>
            <td><span style="color:${task.priority === 'Crítica' ? '#ff0055' : 'inherit'}">${task.priority}</span></td>
            <td>${task.dueDate || 'Sin fecha'}</td>
            <td>
                <button onclick="window.deleteTask('${task.id}')" class="delete-btn" style="padding:5px 10px;">
                    <span>X</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


document.getElementById('task-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    
    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-desc').value,
        status: document.getElementById('task-status').value,
        priority: document.getElementById('task-priority').value,
        dueDate: document.getElementById('task-due-date').value
    };
    
    taskService.createTask(taskData, currentUser.username);
    
    
    e.target.reset();
    renderTasks();
});


document.getElementById('search-input')?.addEventListener('input', (e) => {
    const query = e.target.value;
    const filtered = taskService.searchTasks(query);
    renderTasks(filtered); 
});


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
    
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    
    
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


document.getElementById('task-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value.trim();
    const desc = document.getElementById('task-desc').value.trim();

    if (!title) {
        alert("La tarea debe tener un titulo.");
        return;
    }

    const taskData = {
        title: title,
        description: desc,
        status: document.getElementById('task-status').value,
        priority: document.getElementById('task-priority').value,
        dueDate: document.getElementById('task-due-date').value
    };
    
    taskService.createTask(taskData, currentUser.username);
    
    e.target.reset();
    renderTasks();
});

document.getElementById('search-input')?.addEventListener('input', (e) => {
    const query = e.target.value;
    const filteredTasks = taskService.searchTasks(query);
    renderFilteredTasks(filteredTasks);
});

function renderFilteredTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.status === 'completed' ? 'completed' : '';
        li.innerHTML = `
            <span>${task.title} <small style="color: var(--p3-cyan);">(${task.createdBy})</small></span>
            <div>
                <button onclick="window.toggleTask('${task.id}')"><span>${task.status === 'completed' ? 'Retomar' : 'Completar'}</span></button>
                <button onclick="window.deleteTask('${task.id}')" class="delete-btn"><span>Eliminar</span></button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

renderApp();
