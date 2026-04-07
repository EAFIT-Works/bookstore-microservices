export class DeleteReviewUseCase {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    async execute(bookId, reviewId) {
        return this.reviewRepository.deleteReview(bookId, reviewId);
    }
}

export default DeleteReviewUseCase;
