import docClient from "../../infraestructure/config/dynamo.js";
import { DynamoReviewRepository } from "../../infraestructure/persistence/DynamoReviewRepository.js";
import CreateReviewUseCase from "../../application/use-cases/createReviewUseCase.js";
import DeleteReviewUseCase from "../../application/use-cases/deleteReviewUseCase.js";
import GetReviewUseCase from "../../application/use-cases/getReviewUseCase.js";
import GetReviewsByBookUseCase from "../../application/use-cases/getReviewsByBookUseCase.js";
import UpdateReviewUseCase from "../../application/use-cases/updateReviewUseCase.js";
import { createApp } from "./app.js";

const reviewRepository = new DynamoReviewRepository(docClient);

const deps = {
    createReviewUseCase: new CreateReviewUseCase(reviewRepository),
    deleteReviewUseCase: new DeleteReviewUseCase(reviewRepository),
    getReviewUseCase: new GetReviewUseCase(reviewRepository),
    getReviewsByBookUseCase: new GetReviewsByBookUseCase(reviewRepository),
    updateReviewUseCase: new UpdateReviewUseCase(reviewRepository),
};

const app = createApp(deps);
const port = Number(process.env.PORT) || 3002;

try {
    await reviewRepository.warmupKeyMode();
} catch (e) {
    console.warn(
        "[review-service] Could not describe DynamoDB table (permissions?):",
        e.message
    );
}

app.listen(port, () => {
    console.log(`review-service listening on port ${port}`);
});
