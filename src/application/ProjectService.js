// src/application/ProjectService.js
import { Project } from "../domain/Project.js";

export class ProjectService {
    constructor(repository) {
        this.repository = repository;
    }

    getAllProjects() {
        return this.repository.getAll();
    }

    createProject(name, description, username) {
        const id = 'PRJ-' + Math.floor(Math.random() * 1000);
        const newProject = new Project(id, name, description, username);
        this.repository.save(newProject);
        return newProject;
    }
}