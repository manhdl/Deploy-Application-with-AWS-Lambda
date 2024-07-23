import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('updateTodo');

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
        const todoId = event.pathParameters.todoId;
        const updateData = JSON.parse(event.body);

        try {
            await updateTodo(userId, todoId, updateData);
            logger.info('Successfully get all todo item.');
            return {
                statusCode: 204,
                body: undefined
            };
        } catch (error) {
            logger.error(`Error: ${error.message}`);
            return {
                statusCode: 500,
                body: JSON.stringify({ error })
            };
        }
    })