export interface MenuItemResponseDto {
  id: number;
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
  stallName?: string | null;
}
