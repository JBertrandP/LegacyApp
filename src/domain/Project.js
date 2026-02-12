// src/domain/Project.js
export class Project {
    constructor(id, name, description, createdBy) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAt = new Date();
    }
}