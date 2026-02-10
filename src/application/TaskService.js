import { Task } from "../domain/Task.js";

export class TaskService {
    constructor(repository) {
        this.repository = repository;
    }

    getAllTasks() {
        return this.repository.getAll();
    }

    createTask(taskData, username) {
        const id = Date.now().toString();
        const newTask = new Task(
            id,
            taskData.title,
            taskData.description,
            taskData.status,
            taskData.priority,
            taskData.project,
            taskData.assignedTo,
            taskData.dueDate,
            taskData.hours,
            username
        );
        this.repository.save(newTask);
        return newTask;
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