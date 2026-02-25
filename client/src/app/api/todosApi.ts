import axios, {AxiosError} from "axios";
import type { CreateTodoInput, Todo, ToggleIsDoneInput, UpdateTodoInput } from "./todoApiModels";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5107';

const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export async function getAllTodos(): Promise<Todo[]> {
    try {
        const { data } = await http.get<Todo[]>('/todos');
        return data
    } catch (error) {
        throw toApiError(error)
    }
}

export async function toggleIsDone(id: string, toggleValue: ToggleIsDoneInput): Promise<Todo>{
    try {
        const { data } = await http.patch<Todo>(`/todos/${id}`, toggleValue);
        return data;
    } catch (error) {
        throw toApiError(error);
    }
}

export async function deleteTodo(id: string): Promise<void> {
    try {
        await http.delete<Todo>(`/todos/${id}`);
    } catch (error) {
        throw toApiError(error);
    }
}

export async function createTodo(toCreate: CreateTodoInput): Promise<Todo> {
    try {
        const { data } = await http.post<Todo>(`/todos`, toCreate);
        return data;
    } catch(error) {
        throw toApiError(error);
    }
}

export async function updateTodo(id: string, toEdit: UpdateTodoInput): Promise<Todo> {
    try {
        const { data } = await http.put<Todo>(`/todos/${id}`, toEdit);
        return data;
    } catch(error) {
        throw toApiError(error);
    }
}

function toApiError(error: unknown): Error {
    if (error instanceof AxiosError) {
        const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message ??
        'Request failed'
        return new Error(message)
    }
    return error instanceof Error ? error : new Error('Unknown error')
}