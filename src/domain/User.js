export class User {
    constructor(id, username, role = 'user') {
        if (!username) throw new Error("User requires a username");
        
        this.id = id;
        this.username = username;
        this.role = role; // 'admin', 'user'
    }

    isAdmin() {
        return this.role === 'admin';
    }
}