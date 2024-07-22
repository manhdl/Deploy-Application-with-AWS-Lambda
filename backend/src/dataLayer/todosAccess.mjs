import { createLogger } from "../utils/logger.mjs";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const logger = createLogger("TodosAcess");
const todosUserIndex = process.env.TODOS_USER_INDEX;
const groupsTable = process.env.TODOS_TABLE;
const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB());

export async function getAllTodoAsync(userId) {
    logger.info("Get all todo function called");

    const result = await dynamoDbDocument.query({
        TableName: groupsTable,
        IndexName: todosUserIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId,
        },
    });

    return result.Items;
}

export async function createTodoItem(todoItem) {
    logger.info("Create todo item function calles");

    await dynamoDbDocument.put({
        TableName: groupsTable,
        Item: todoItem,
    });

    return todoItem;
}

export async function updateTodoItem(userId, todoId, updateData) {
    logger.info(`
        Updating a todo item: $ { todoId }
        `);

    await dynamoDbDocument.update({
        TableName: groupsTable,
        key: { userId, todoId },
        UpdateExpression: "set #n = :n, dueDate = :due, done = :dn",
        ExpressionAttributeNames: { "#n": "name" },
        ExpressionAttributeValues: {
            ":n": updateData.name,
            ":due": updateData.dueDate,
            ":dn": updateData.done,
        },
    });
}

export async function deleteTodoItem(userId, todoId) {
    await dynamoDbDocument.delete({
        TableName: groupsTable,
        Key: { userId, todoId },
    });
}

export async function saveImgUrl(userId, todoId, bucketName) {
    await dynamoDbDocument.update({
        TableName: groupsTable,
        Key: { userId, todoId },
        ConditionExpression: "attribute_exists(todoId)",
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
            ":attachmentUrl": `
        https: //${bucketName}.s3.amazonaws.com/${todoId}`,
        },
    });
}