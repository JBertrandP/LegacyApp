export class Task {
    constructor(id, title, description, status, priority, project, assignedTo, dueDate, hours, createdBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status || 'Pendiente';
        this.priority = priority || 'Media';
        this.project = project || 'General';
        this.assignedTo = assignedTo;
        this.dueDate = dueDate;
        this.hours = hours || 0;
        this.createdBy = createdBy;
    }
} 