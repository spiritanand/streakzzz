import { z } from "zod";
import { TodoTypes } from "./types.js";
export declare const signUpSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export type TSignUpSchema = z.infer<typeof signUpSchema>;
export declare const loginSchema: z.ZodObject<Omit<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "name">, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type TLoginSchema = z.infer<typeof loginSchema>;
export declare const addTodoSchema: z.ZodObject<{
    content: z.ZodEffects<z.ZodString, string, string>;
    type: z.ZodNativeEnum<typeof TodoTypes>;
}, "strip", z.ZodTypeAny, {
    type: TodoTypes;
    content: string;
}, {
    type: TodoTypes;
    content: string;
}>;
export type TAddTodoSchema = z.infer<typeof addTodoSchema>;
export declare const toggleTodoSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export type TToggleTodoSchema = z.infer<typeof toggleTodoSchema>;
export declare const editTodoSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof TodoTypes>;
    content: z.ZodEffects<z.ZodString, string, string>;
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: TodoTypes;
    content: string;
    id: number;
}, {
    type: TodoTypes;
    content: string;
    id: number;
}>;
export type TEditTodoSchema = z.infer<typeof editTodoSchema>;
