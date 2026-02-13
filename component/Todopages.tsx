"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/config/data";
import { Loader } from "lucide-react";
import { error } from "console";


type Todo = {
    _id: string;
    title: string;
    completed: boolean;
};

type FormValues = {
    title: string;
};

export default function TodoForm() {
    const { register, handleSubmit,setError, formState: { errors, isSubmitting },} = useForm<FormValues>();
    const [todos, setTodos] = useState<Todo[]>([]);


    const fetchTodos = async () => {
        try {
             const res = await axios.get(`${BACKEND_URL}/api/v1/`, { withCredentials: true });
             setTodos(res.data);
        } catch (error: any) {
           setError("root", {
            message: error?.response?.data?.message || "Failed to fetch todos",
           })
        }
       
    };

    useEffect(() => {
        fetchTodos();
    }, []);


    const onSubmit = async (data: FormValues) => {
        try {

            await axios.post(`${BACKEND_URL}/api/v1/`, data, { withCredentials: true });
            fetchTodos();
        } catch (err: any) {
           setError("root", {
            message: err?.response?.data?.message || "Failed to add todo",
           })
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/${id}`, { withCredentials: true });
        fetchTodos();
        } catch (error: any) {
            setError("root", {
            message: error?.response?.data?.message || "Failed to delete todo",
           })
        }
        
    };
    const toggleTodo = async (todo: Todo) => {
        try {
            await axios.put(
            `${BACKEND_URL}/api/v1/${todo._id}`,
            { completed: !todo.completed },
            { withCredentials: true }
        );
        fetchTodos();
        } catch (error: any) {
            setError("root", {
            message: error?.response?.data?.message || "Failed to toggle todo",
           })
        }
        
    };

    return (
        <div className="max-w-md mx-auto mt-10 space-y-4">
            {/* FORM */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-2"
            >
                <div className="flex-1">
                    <input
                        {...register("title", { required: "Title is required" })}
                        placeholder="Enter todo..."
                        className="border p-2 w-full rounded"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    {errors.root && <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>}
                </div>

                <button
                    disabled={isSubmitting}
                    className="bg-black text-white px-4 rounded"
                >
                    {isSubmitting? <Loader className="animate-spin" /> : "Add"}
                </button>
            </form>

            {/* LIST */}
            <div className="space-y-2">
                {todos.map((todo) => (
                    <div
                        key={todo._id}
                        className="flex justify-between items-center border p-2 rounded"
                    >
                        <span
                            onClick={() => toggleTodo(todo)}
                            className={`cursor-pointer ${todo.completed ? "line-through text-gray-400" : ""
                                }`}
                        >
                            {todo.title}
                        </span>

                        <button
                            onClick={() => deleteTodo(todo._id)}
                            className="text-red-500"
                        >
                            Delete
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
}