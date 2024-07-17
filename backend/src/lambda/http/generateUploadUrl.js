import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { generateUploadUrl } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('DeleteTodo');

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
    .handler(async(event) => {
        // Write your logic here
        logger.info('Processing generate upload url event...');

        const userId = getUserId(event);
        const todoId = event.pathParameters.todoId;

        try {
            const signedUrl = await generateUploadUrl(userId, todoId);
            logger.info('Successfully generate upload url.');
            return {
                statusCode: 201,
                body: JSON.stringify({ uploadUrl: signedUrl })
            };
        } catch (error) {
            logger.error(`Error: ${error.message}`);
            return {
                statusCode: 500,
                body: JSON.stringify({ error })
            };
        }
    })