import { LocalStorageTaskRepository } from "../storage/LocalStorageTaskRepository.js";
import { LocalStorageProjectRepository } from "../storage/LocalStorageProjectRepository.js";
import { LocalAuthAdapter } from "../auth/LocalAuthAdapter.js";
import { TaskService } from "../../application/TaskService.js";
import { ProjectService } from "../../application/ProjectService.js";
import { ReportService } from "../../application/ReportService.js";


const taskRepo = new LocalStorageTaskRepository();
const projectRepo = new LocalStorageProjectRepository();
const authAdapter = new LocalAuthAdapter();

const taskService = new TaskService(taskRepo);
const projectService = new ProjectService(projectRepo);

let currentUser = authAdapter.getCurrentUser();


function renderTasks(tasksToRender = taskService.getAllTasks()) {
    const tbody = document.getElementById('tasksTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    tasksToRender.forEach(task => {
        const isComp = task.status === 'Completada';
        const tr = document.createElement('tr');
        
        if (isComp) tr.style.opacity = "0.4";

        tr.innerHTML = `
            <td style="font-size: 0.7rem; color: #666;">${task.id.slice(-4)}</td>
            <td style="font-weight:bold; color:var(--p3-cyan)">${task.title}</td>
            <td><span class="badge">${task.status}</span></td>
            <td><span style="color:${task.priority === 'Crítica' ? '#ff4488' : 'white'}">${task.priority}</span></td>
            <td>${task.project || 'General'}</td>
            <td>${task.dueDate || 'Sin fecha'}</td>
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
    updateReportStats(); 
}


function renderProjects() {
    const projects = projectService.getAllProjects();
    const tbody = document.getElementById('project-list-body');
    const select = document.getElementById('task-project-select'); 
    
    if (tbody) {
        tbody.innerHTML = '';
        projects.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${p.id}</td><td>${p.name}</td><td>${p.createdBy}</td>`;
            tbody.appendChild(tr);
        });
    }

    
    if (select) {
        select.innerHTML = '<option value="General">Sin Proyecto (General)</option>';
        projects.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.name;
            opt.textContent = p.name;
            select.appendChild(opt);
        });
    }
}


function updateReportStats() {
    const totalEl = document.getElementById('total-tasks-stat');
    if (totalEl) {
        totalEl.textContent = taskService.getAllTasks().length;
    }
}

window.exportData = () => {
    const tasks = taskService.getAllTasks();
    ReportService.exportToCSV(tasks);
};




document.getElementById('task-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value.trim();
    if (!title) return alert("El título es obligatorio");

    const data = {
        title: title,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value,
        priority: document.getElementById('taskPriority').value,
        project: document.getElementById('task-project-select')?.value || 'General',
        dueDate: document.getElementById('taskDueDate').value
    };
    
    taskService.createTask(data, currentUser.username);
    e.target.reset(); 
    renderTasks();
});


document.getElementById('project-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('project-name').value.trim();
    const desc = document.getElementById('project-desc').value;
    
    if (name) {
        projectService.createProject(name, desc, currentUser.username);
        e.target.reset();
        renderProjects();
        alert("Proyecto creado con éxito");
    }
});


window.toggleTask = (id) => {
    taskService.toggleTaskStatus(id);
    renderTasks();
};

window.deleteTask = (id) => {
    taskService.deleteTask(id);
    renderTasks();
};

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
    if (selected) {
        selected.style.display = 'block';
        if (tabName === 'projects') renderProjects();
        if (tabName === 'reports') updateReportStats();
    }
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
        renderProjects();
        window.showTab('tasks');
    } else {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('app-section').style.display = 'none';
    }
}

renderApp();