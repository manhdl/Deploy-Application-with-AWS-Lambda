import * as uuid from "uuid";
import { getAllTodoAsync, createTodoItem, updateTodoItem, deleteTodoItem, saveImgUrl } from "../dataLayer/todosAccess.mjs"

export async function getAllTodo(userId) {
    return await getAllTodoAsync(userId);
}

export async function createTodo(userId, newTodoData) {
    const todoId = uuid.v4();
    const createdAt = new Date().toISOString();
    const done = false;
    const newTodo = { todoId, userId, createdAt, done, ...newTodoData };
    return await createTodoItem(newTodo);
}

export async function updateTodo(userId, todoId, updateData) {
    return await updateTodoItem(userId, todoId, updateData);
}

export async function deleteTodo(userId, todoId) {
    return await deleteTodoItem(userId, todoId);
}

export async function generateUploadUrl(userId, todoId) {
    const bucketName = process.env.IMAGES_S3_BUCKET;
    const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10);
    const s3 = new AWS.S3({ signatureVersion: "v4" });
    const signedUrl = s3.getSignedUrl("putObject", {
        Bucket: bucketName,
        Key: todoId,
        Expires: urlExpiration,
    });
    await saveImgUrl(userId, todoId, bucketName);
    return signedUrl;
}