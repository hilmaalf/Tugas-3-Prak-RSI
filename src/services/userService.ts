import { UserRepository, type CreateUserInput } from '../repositories/userRepository.ts';
import type { UserResponseDto } from '../dtos/userDto.ts';

type UserRow = { id: number; name: string; email: string; role: string; createdAt: Date | null };

export class UserService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

  private toDto(row: UserRow): UserResponseDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt,
    };
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const rows = await this.userRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const row = await this.userRepository.findById(id);
    if (!row) throw new Error('USER_NOT_FOUND');
    return this.toDto(row);
  }

  async createUser(input: CreateUserInput): Promise<UserResponseDto> {
    const row = await this.userRepository.create(input);
    if (!row) throw new Error('USER_NOT_FOUND');
    return this.toDto(row);
  }
}
