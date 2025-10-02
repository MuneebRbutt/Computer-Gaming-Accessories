// Shared user storage - in production, this should be a database
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  createdAt?: Date;
}

// Demo users storage (shared between auth and signup)
export const users: UserRecord[] = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCa.0jCGgN/6I.", // "password"
    role: "user",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfCa.0jCGgN/6I.", // "password"
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
];

// Utility function to find user by email
export const findUserByEmail = (email: string): UserRecord | undefined => {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

// Utility function to add a new user
export const addUser = (user: UserRecord): void => {
  users.push(user);
};

// Utility function to check if user exists
export const userExists = (email: string): boolean => {
  return !!findUserByEmail(email);
};

