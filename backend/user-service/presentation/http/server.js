import { prisma } from "../../infraestructure/persistence/database.js";
import { PrismaUserRepository } from "../../infraestructure/persistence/PrismaUserRepository.js";
import CreateUserUseCase from "../../application/use-cases/createUserUseCase.js";
import DeleteUserUseCase from "../../application/use-cases/deleteUserUseCase.js";
import GetUserByIdUseCase from "../../application/use-cases/getUserByIdUseCase.js";
import GetUsersUseCase from "../../application/use-cases/getUsersUseCase.js";
import UpdateUserUseCase from "../../application/use-cases/updateUserUseCase.js";
import RegisterUserUseCase from "../../application/use-cases/registerUserUseCase.js";
import LoginUserUseCase from "../../application/use-cases/loginUserUseCase.js";
import RefreshTokenUseCase from "../../application/use-cases/refreshTokenUseCase.js";
import DebitBalanceUseCase from "../../application/use-cases/debitBalanceUseCase.js";
import { createApp } from "./app.js";

const userRepository = new PrismaUserRepository(prisma);

const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);

const deps = {
    createUserUseCase,
    deleteUserUseCase: new DeleteUserUseCase(userRepository),
    getUserByIdUseCase,
    getUsersUseCase: new GetUsersUseCase(userRepository),
    updateUserUseCase,
    registerUserUseCase: new RegisterUserUseCase(
        userRepository,
        createUserUseCase
    ),
    loginUserUseCase: new LoginUserUseCase(userRepository),
    refreshTokenUseCase: new RefreshTokenUseCase(getUserByIdUseCase),
    debitBalanceUseCase: new DebitBalanceUseCase(
        getUserByIdUseCase,
        updateUserUseCase
    ),
};

const app = createApp(deps);
const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
    console.log(`user-service listening on port ${port}`);
});
