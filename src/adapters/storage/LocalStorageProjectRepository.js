// src/adapters/storage/LocalStorageProjectRepository.js
import { Project } from "../../domain/Project.js";

export class LocalStorageProjectRepository {
    constructor() {
        this.STORAGE_KEY = 'projects_hexagonal';
    }

    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data).map(p => new Project(p.id, p.name, p.description, p.createdBy));
    }

    save(project) {
        const projects = this.getAll();
        projects.push(project);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    }
}