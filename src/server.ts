import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import userRoutes from "./api/routes/routes";
import dotenv from "dotenv";

dotenv.config();

const server = fastify();

server.register(fastifyCors, {
  origin: `http://localhost:${3000}`,
});

server.register(userRoutes);

const start = async () => {
  try {
    await server.listen({ port: 3333, host: '0.0.0.0' });
    console.log(`Server listening on http://localhost:${3333}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
