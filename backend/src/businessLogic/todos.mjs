import * as uuid from "uuid";
import { getAllTodoAsync, createTodoItem, updateTodoItem, deleteTodoItem } from "../dataLayer/todosAccess.mjs"
import { getUploadUrl, saveImgUrl } from '../fileStorage/attachmentUtils.mjs'

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
    var url = await getUploadUrl(todoId);
    console.log(`url: ${url}`)
    await saveImgUrl(userId, todoId);
    return url;
}