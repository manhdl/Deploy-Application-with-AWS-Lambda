import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import { createTodo } from "../../businessLogic/todos.mjs";
import { getUserId } from "../utils.mjs";
import { createLogger } from "../../utils/logger.mjs";

const logger = createLogger("createTodo");

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true,
        })
    )
    .handler(async(event) => {
        // Write your logic here
        logger.info("Processing CreateTodo event...");

        const userId = getUserId(event);
        const newTodoData = JSON.parse(event.body);

        try {
            const newTodo = await createTodo(userId, newTodoData);
            logger.info("Successfully created a new todo item.");
            return {
                statusCode: 201,
                body: JSON.stringify({
                    item: newTodo,
                }),
            };
        } catch (error) {
            logger.error(`Error: ${error.message}`);
            return {
                statusCode: 500,
                body: JSON.stringify({ error }),
            };
        }
    });