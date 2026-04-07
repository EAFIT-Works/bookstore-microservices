export class GetReviewsByBookUseCase {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    async execute(bookId) {
        return this.reviewRepository.getReviewsByBookId(bookId);
    }
}

export default GetReviewsByBookUseCase;
