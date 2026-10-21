import { LikeRepository, type CreateLikeInput } from '../repositories/likeRepository.ts';
import type { LikeResponseDto } from '../dtos/likeDto.ts';

export class LikeService {
  constructor(private likeRepository: LikeRepository = new LikeRepository()) {}

  private toDto(row: any): LikeResponseDto {
    return {
      id: row.id,
      reviewId: row.reviewId,
      userId: row.userId,
      createdAt: row.createdAt,
    };
  }

  async createLike(input: CreateLikeInput): Promise<LikeResponseDto> {
    const row = await this.likeRepository.create(input);
    if (!row) throw new Error('LIKE_NOT_FOUND');
    return this.toDto(row);
  }

  async deleteLike(id: number): Promise<LikeResponseDto> {
    const row = await this.likeRepository.remove(id);
    if (!row) throw new Error('LIKE_NOT_FOUND');
    return this.toDto(row);
  }
}
