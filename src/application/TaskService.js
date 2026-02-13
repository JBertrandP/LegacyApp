import { Task } from "../domain/Task.js";

export class TaskService {
    constructor(repository) {
        this.repository = repository;
    }

    createTask(data, username) {
        const id = 'TSK-' + Math.floor(Math.random() * 1000);
        const newTask = new Task(
            id, data.title, data.description, data.status, 
            data.priority, data.project, data.assigned, 
            data.dueDate, data.hours, username
        );
        this.repository.save(newTask);
        return newTask;
    }

    getAll() { return this.repository.getAll(); }

    
    generateCSV() {
        const tasks = this.repository.getAll();
        if (tasks.length === 0) return null;

        const headers = "ID,Titulo,Estado,Prioridad,Proyecto,Vencimiento\n";
        const rows = tasks.map(t => 
            `${t.id},${t.title},${t.status},${t.priority},${t.project},${t.dueDate}`
        ).join("\n");
        
        return headers + rows;
    }
}