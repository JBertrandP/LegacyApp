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
        const isComp = task.status === 'Completada';
        const tr = document.createElement('tr');
        
        if (isComp) {
            tr.style.opacity = "0.4";
            tr.style.textDecoration = "line-through";
        }

        tr.innerHTML = `
            <td style="font-size: 0.7rem; color: #666;">${task.id.slice(-4)}</td>
            <td style="font-weight:bold; color:var(--p3-cyan)">${task.title}</td>
            <td><span class="badge" style="${isComp ? 'background:#888' : ''}">${task.status}</span></td>
            <td style="color:${task.priority === 'Crítica' ? '#ff4488' : 'white'}">${task.priority}</td>
            <td>${task.dueDate ? task.dueDate : 'Sin fecha'}</td>
            <td>
                <button onclick="window.toggleTask('${task.id}')" style="padding:5px 10px; background:${isComp ? '#888' : 'var(--p3-cyan)'}; color:var(--p3-dark-blue);">
                    <span>${isComp ? '↺' : '✔'}</span>
                </button>
                <button onclick="window.deleteTask('${task.id}')" class="delete-btn" style="padding:5px 10px;">
                    <span>X</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


window.toggleTask = (id) => {
    taskService.toggleTaskStatus(id);
    renderTasks();
};


document.getElementById('task-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    

    const titleEl = document.getElementById('taskTitle');
    const descEl = document.getElementById('taskDescription');
    const statusEl = document.getElementById('taskStatus');
    const priorityEl = document.getElementById('taskPriority');
    const dateEl = document.getElementById('taskDueDate');


    if (!titleEl.value.trim()) {
        alert("Error: El título de la tarea es obligatorio.");
        return;
    }

    const data = {
        title: titleEl.value.trim(),
        description: descEl.value,
        status: statusEl.value,
        priority: priorityEl.value,
        dueDate: dateEl.value
    };
    
    taskService.createTask(data, currentUser.username);
    
    e.target.reset(); 
    renderTasks();
});


window.handleLogin = () => {
    const userIn = document.getElementById('username').value;
    const passIn = document.getElementById('password').value;
    try {
        currentUser = authAdapter.login(userIn, passIn);
        renderApp();
    } catch (e) { alert(e.message); }
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