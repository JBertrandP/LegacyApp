import { Task } from "../domain/Task.js";

export class TaskService {
    constructor(repository) {
        this.repository = repository;
    }

    getAllTasks() {
        return this.repository.getAll();
    }

    createTask(data, username) {
        const id = Math.floor(Math.random() * 10000).toString();
        
        
        const newTask = new Task(
            id,
            data.title,
            data.description,
            data.status || 'Pendiente',
            data.priority || 'Media',
            "General",       // project
            username,        // assignedTo
            data.dueDate,    // fecha
            0,               // hours
            username         // createdBy
        );

        this.repository.save(newTask);
        return newTask;
    }

    
    searchTasks(query) {
        const allTasks = this.repository.getAll();
        if (!query) return allTasks;
        
        const q = query.toLowerCase();
        return allTasks.filter(t => 
            (t.title && t.title.toLowerCase().includes(q)) || 
            (t.description && t.description.toLowerCase().includes(q))
        );
    }

    deleteTask(id) {
        this.repository.delete(id);
    }

    toggleTaskStatus(id) {
        const tasks = this.repository.getAll();
        const t = tasks.find(item => item.id === id);
        
        if (t) {
            
            const task = new Task(
                t.id, 
                t.title, 
                t.description, 
                t.status, 
                t.priority,
                t.project,
                t.assignedTo,
                t.dueDate,
                t.hours,
                t.createdBy
            );

            
            task.status = (task.status === 'Completada') ? 'Pendiente' : 'Completada';
            
            
            this.repository.update(task);
        }
    }
}