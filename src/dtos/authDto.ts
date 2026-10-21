export interface AuthUserDto {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'customer';
}

export interface RegisterResponseDto {
  user: AuthUserDto;
}

export interface LoginResponseDto {
  token: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: AuthUserDto;
}

