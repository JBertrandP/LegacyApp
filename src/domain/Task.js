/*Represents a task in the system.
 *This entity belongs to the Domain Layer and contains core business logic.*/
export class Task {
    constructor(id, title, description, status = 'pending', createdBy) {
        if (!title) throw new Error("Task must have a title");
        
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status; 
        this.createdBy = createdBy;
        this.createdAt = new Date();
    }

    complete() {
        this.status = 'completed';
    }

    isCompleted() {
        return this.status === 'completed';
    }
    
    updateTitle(newTitle) {
        if (!newTitle) throw new Error("Title cannot be empty");
        this.title = newTitle;
    }
}