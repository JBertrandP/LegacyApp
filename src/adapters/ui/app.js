import { LocalStorageTaskRepository } from "../storage/LocalStorageTaskRepository.js";
import { LocalStorageProjectRepository } from "../storage/LocalStorageProjectRepository.js";
import { TaskService } from "../../application/TaskService.js";
import { ProjectService } from "../../application/ProjectService.js";

const taskService = new TaskService(new LocalStorageTaskRepository());
const projectService = new ProjectService(new LocalStorageProjectRepository());
let currentUser = null;


window.login = () => {
    const user = document.getElementById('username').value;
    if (user) {
        currentUser = user;
        document.getElementById('loginPanel').style.display = 'none';
        document.getElementById('mainPanel').style.display = 'block';
        document.getElementById('currentUser').textContent = currentUser;
        renderProjects();
        renderTasks();
    }
};


window.addProject = () => {
    const data = {
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value
    };
    if (!data.name) return alert("Nombre del proyecto requerido");
    
    projectService.createProject(data, currentUser);
    renderProjects();
    updateProjectSelect(); 
    alert("Proyecto guardado.");
};

function renderProjects() {
    const projects = projectService.getAll();
    const tbody = document.getElementById('projectsTableBody');
    tbody.innerHTML = projects.map(p => `
        <tr><td>${p.id}</td><td>${p.name}</td><td>${p.description}</td></tr>
    `).join('');
}


function updateProjectSelect() {
    const select = document.getElementById('taskProject');
    const projects = projectService.getAll();
    select.innerHTML = projects.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
    if (projects.length === 0) select.innerHTML = '<option value="General">General</option>';
}

window.addTask = () => {
    const data = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value,
        priority: document.getElementById('taskPriority').value,
        project: document.getElementById('taskProject').value,
        dueDate: document.getElementById('taskDueDate').value,
        assigned: document.getElementById('taskAssigned').value,
        hours: document.getElementById('taskHours').value
    };
    
    if (!data.title) return alert("Título requerido");
    
    taskService.createTask(data, currentUser);
    renderTasks();
    alert("Tarea añadida al proyecto " + data.project);
};

function renderTasks() {
    const tasks = taskService.getAll();
    const tbody = document.getElementById('tasksTableBody');
    tbody.innerHTML = tasks.map(t => `
        <tr>
            <td>${t.id}</td><td>${t.title}</td><td>${t.status}</td>
            <td>${t.priority}</td><td>${t.project}</td>
            <td>${t.assignedTo || '-'}</td><td>${t.dueDate}</td>
        </tr>
    `).join('');
}


window.exportCSV = () => {
    const csvContent = taskService.generateCSV();
    if (!csvContent) return alert("No hay datos para exportar");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_General_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
};

window.showTab = (tabName) => {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    if (tabName === 'tasks') updateProjectSelect();
};