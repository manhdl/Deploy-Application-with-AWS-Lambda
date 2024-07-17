import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger.mjs';

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('TodosAcess');

export class TodoAcess {
    contructor() {
        this.docClient = createDynamoDBClient();
        this.todosTable = process.env.TODOS_TABLE;
        this.todosUserIndex = process.env.TODOS_USER_INDEX;
    };

    async getTodos(userId) {
        logger.info('Get all todo function called')

        const result = await docClient.quey({
            TableName: todosTable,
            IndexName: INDEX_NAME,
            KeyConditionExpression: 'userId = : userId',
            ExpresstionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        return result.Items;
    }

    async createTodoItem(todoItem) {
        logger.info('Create todo item function calles');

        await docClient.put({
            TableName: todosTable,
            Item: todoItem
        }).promise();

        return todoItem;
    }

    async updateTodo(userId, todoId, updateData) {
        logger.info(`Updating a todo item: ${todoId}`);
        await this.docClient
            .update({
                TableName: this.todosTable,
                Key: { userId, todoId },
                ConditionExpression: 'attribute_exists(todoId)',
                UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
                ExpressionAttributeNames: { '#n': 'name' },
                ExpressionAttributeValues: {
                    ':n': updateData.name,
                    ':due': updateData.dueDate,
                    ':dn': updateData.done
                }
            })
            .promise();
    }

    async deleteTodo(userId, todoId) {
        await this.docClient
            .delete({
                TableName: this.todosTable,
                Key: { userId, todoId }
            })
            .promise();
    }

    async saveImgUrl(userId, todoId, bucketName) {
        await this.docClient
            .update({
                TableName: this.todosTable,
                Key: { userId, todoId },
                ConditionExpression: 'attribute_exists(todoId)',
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {
                    ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
                }
            })
            .promise();
    }
};

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.info('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8005'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}