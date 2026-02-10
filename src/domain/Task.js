/*Represents a task in the system.
 *This entity belongs to the Domain Layer and contains core business logic.*/
export class Task {
    constructor(id, title, description, status, priority, project, assignedTo, dueDate, hours, createdBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status || 'Pendiente';
        this.priority = priority || 'Media';
        this.project = project || 'General';
        this.assignedTo = assignedTo || createdBy;
        this.dueDate = dueDate;
        this.hours = hours || 0;
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