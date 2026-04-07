import { v4 as uuidv4 } from "uuid";
import { Review } from "../../domain/entities/review.js";

export class CreateReviewUseCase {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    async execute(dto) {
        const createdAt = new Date().toISOString();
        const review = new Review(
            dto.bookId,
            uuidv4(),
            dto.userId,
            dto.rating,
            dto.comment ?? "",
            createdAt
        );
        return this.reviewRepository.createReview(review);
    }
}

export default CreateReviewUseCase;
