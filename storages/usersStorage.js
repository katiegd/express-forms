class UsersStorage {
  constructor(initialUsers = []) {
    this.storage = {};
    this.id = 0;

    initialUsers.forEach((user) => this.addUser(user));
  }

  addUser({ firstName, lastName, email, age, bio }) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName, email, age, bio };
    this.id++;
  }

  getUsers() {
    return Object.values(this.storage);
  }

  searchUsers(filter = {}) {
    return Object.values(this.storage).filter((user) => {
      let isMatch = true;

      if (filter.lastName) {
        isMatch =
          isMatch &&
          user.lastName.toLowerCase().includes(filter.lastName.toLowerCase());
      }
      if (filter.email) {
        isMatch =
          isMatch && user.email.toLowerCase() === filter.email.toLowerCase();
      }

      return isMatch;
    });
  }

  getUser(id) {
    return this.storage[id];
  }

  updateUser(id, { firstName, lastName, email, age, bio }) {
    this.storage[id] = { id, firstName, lastName, email, age, bio };
  }

  deleteUser(id) {
    delete this.storage[id];
  }
}

module.exports = new UsersStorage([
  {
    firstName: "Katie",
    lastName: "Duryea",
    email: "butts@gmail.com",
    age: 25, // Optional
    bio: "Enjoys hiking and outdoor activities", // Optional
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    age: 30, // Optional
    bio: "Loves reading and writing", // Optional
  },
]);
