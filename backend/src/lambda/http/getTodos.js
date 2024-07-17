import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodos } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('createTodo');

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
    .handler(async(event) => {
        // Write your logic here
        logger.info('Processing GetTodos event...');

        const userId = getUserId(event);

        try {
            const todoList = await getTodos(userId);
            logger.info('Successfully get all todo item.');
            return {
                statusCode: 200,
                body: JSON.stringify({ todoList })
            };
        } catch (error) {
            logger.error(`Error: ${error.message}`);
            return {
                statusCode: 500,
                body: JSON.stringify({ error })
            };
        }
    })