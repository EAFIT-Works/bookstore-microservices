export class User {
    constructor(id, email, firstName, lastName, balance, passwordHash) {
        if (typeof id === "object" && id !== null && email === undefined) {
            const o = id;
            this.id = o.id;
            this.email = o.email;
            this.firstName = o.firstName;
            this.lastName = o.lastName;
            this.balance = o.balance ?? 0;
            this.passwordHash = o.passwordHash;
            return;
        }
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.balance = balance ?? 0;
        this.passwordHash = passwordHash;
    }
}
