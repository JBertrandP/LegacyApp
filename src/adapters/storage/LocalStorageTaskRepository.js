import { TaskRepository } from "../../ports/TaskRepository.js";
import { Task } from "../../domain/Task.js";

export class LocalStorageTaskRepository extends TaskRepository {
    constructor() {
        super();
        this.STORAGE_KEY = 'tasks_hexagonal';
    }

    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return [];
        
        const rawTasks = JSON.parse(data);
        
        return rawTasks.map(t => {
            return new Task(
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
        });
    }

    save(task) {
        const tasks = this.getAll();
        tasks.push(task);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }

    delete(id) {
        let tasks = this.getAll();
        tasks = tasks.filter(t => t.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }

    update(updatedTask) {
        let tasks = this.getAll();
        const index = tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
            tasks[index] = updatedTask;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
        }
    }
}