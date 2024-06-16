import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { saveUsers, getUsers } from "../model/user";

interface RegisterBody {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const userRoutes = async (server: FastifyInstance) => {
    server.post("/registrar", async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
        try {
            const { name, email, password, confirmPassword } = request.body;
            if (!name || !email || !password || !confirmPassword) {
                reply.code(400).send({ message: "All fields are required" });
                return;
            }
            if (password !== confirmPassword) {
                reply.code(400).send({ message: "Passwords don't match" });
                return;
            }

            const users = await getUsers();
            if (users.find((user) => user.email === email)) {
                reply.code(400).send({ message: "Email already registered" });
                return;
            }

            const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
            const newUser = { id, name, email, password, confirmPassword };

            users.push(newUser);
            await saveUsers(users);

            reply.code(201).send(newUser);
        } catch (error) {
            reply.code(500).send({ message: "Internal server error" });
        }
    });

    server.get("/users", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const users = await getUsers();
            reply.send(users);
        } catch (error) {
            reply.code(500).send({ message: "Internal server error" });
        }
    });

    server.get("/user/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const users = await getUsers();
            const user = users.find((user) => user.id === parseInt(request.params.id));
            if (!user) {
                reply.code(404).send({ message: "User not found" });
                return;
            }
            reply.send(user);
        } catch (error) {
            reply.code(500).send({ message: "Internal server error" });
        }
    });

    server.put("/user/:id", async (request: FastifyRequest<{ Params: { id: string }, Body: RegisterBody }>, reply: FastifyReply) => {
        try {
            const { name, email, password, confirmPassword } = request.body;
            if (!name || !email || !password || !confirmPassword) {
                reply.code(400).send({ message: "All fields are required" });
                return;
            }
            if (password !== confirmPassword) {
                reply.code(400).send({ message: "Passwords don't match" });
                return;
            }

            const users = await getUsers();
            const userIndex = users.findIndex((user) => user.id === parseInt(request.params.id));
            if (userIndex === -1) {
                reply.code(404).send({ message: "User not found" });
                return;
            }

            const updatedUser = { id: parseInt(request.params.id), name, email, password, confirmPassword };
            users[userIndex] = updatedUser;
            await saveUsers(users);

            reply.send(updatedUser);
        } catch (error) {
            reply.code(500).send({ message: "Internal server error" });
        }
    });

    server.delete("/user/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const users = await getUsers();
            const userIndex = users.findIndex((user) => user.id === parseInt(request.params.id));
            if (userIndex === -1) {
                reply.code(404).send({ message: "User not found" });
                return;
            }

            users.splice(userIndex, 1);
            await saveUsers(users);

            reply.send({ message: "User deleted" });
        } catch (error) {
            reply.code(500).send({ message: "Internal server error" });
        }
    });
};

export default userRoutes;
