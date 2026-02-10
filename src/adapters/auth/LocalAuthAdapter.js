import { AuthRepository } from "../../ports/AuthRepository.js";
import { User } from "../../domain/User.js";

export class LocalAuthAdapter extends AuthRepository {
    constructor() {
        super();
        this.SESSION_KEY = 'user_session';
    }

    login(username, password) {
        if (username === 'admin' && password === 'admin123') {
            const user = new User(1, 'admin', 'admin');
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
            return user;
        }
        throw new Error("Invalid credentials");
    }

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
    }

    getCurrentUser() {
        const data = localStorage.getItem(this.SESSION_KEY);
        if (!data) return null;
        const parsed = JSON.parse(data);
        return new User(parsed.id, parsed.username, parsed.role);
    }
}