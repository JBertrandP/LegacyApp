import { Project } from "../domain/Project.js";

export class ProjectService {
    constructor(repository) {
        this.repository = repository;
    }

    createProject(data, username) {
        const id = 'PRJ-' + Math.floor(Math.random() * 1000);
        const newProject = new Project(id, data.name, data.description, username);
        this.repository.save(newProject);
        return newProject;
    }

    getAll() { return this.repository.getAll(); }
}