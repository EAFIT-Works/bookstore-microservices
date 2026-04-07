export class UpdateReviewUseCase {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    async execute(review) {
        return this.reviewRepository.updateReview(review);
    }
}

export default UpdateReviewUseCase;
