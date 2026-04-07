export class GetReviewUseCase {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    async execute(bookId, reviewId) {
        return this.reviewRepository.getReview(bookId, reviewId);
    }
}

export default GetReviewUseCase;
