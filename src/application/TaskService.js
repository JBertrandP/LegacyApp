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
            data.status,
            data.priority,
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
        const taskData = tasks.find(t => t.id === id);
        
        if (taskData) {
            const task = new Task(
                taskData.id, 
                taskData.title, 
                taskData.description, 
                taskData.status, 
                taskData.createdBy
            );
            
            if (task.isCompleted()) {
                task.status = 'pending'; 
            } else {
                task.complete();
            }
            
            this.repository.update(task);
        }
    }
    searchTasks(query) {
        const allTasks = this.repository.getAll();
        if (!query) return allTasks;
        
        return allTasks.filter(task => 
            task.title.toLowerCase().includes(query.toLowerCase()) || 
            task.description.toLowerCase().includes(query.toLowerCase())
        );
    }
}