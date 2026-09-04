export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface IRegistrationRepository {
  findByEmail(email: string): Promise<RegisteredUser | null>;
  create(name: string, email: string): Promise<RegisteredUser>;
  count(): Promise<number>;
  clear(): Promise<void>;
}

class InMemoryRegistrationRepository implements IRegistrationRepository {
  private users = new Map<string, RegisteredUser>();
  private baseCount = 520; // Base social proof count

  async findByEmail(email: string): Promise<RegisteredUser | null> {
    const normalized = email.trim().toLowerCase();
    return this.users.get(normalized) || null;
  }

  async create(name: string, email: string): Promise<RegisteredUser> {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const user: RegisteredUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    };
    this.users.set(normalizedEmail, user);
    return user;
  }

  async count(): Promise<number> {
    return this.baseCount + this.users.size;
  }

  async clear(): Promise<void> {
    this.users.clear();
  }
}

// Global singleton instance
const globalForRepo = globalThis as unknown as {
  registrationRepo?: IRegistrationRepository;
};

export const registrationRepository: IRegistrationRepository =
  globalForRepo.registrationRepo ?? new InMemoryRegistrationRepository();

if (process.env.NODE_ENV !== "production") {
  globalForRepo.registrationRepo = registrationRepository;
}
