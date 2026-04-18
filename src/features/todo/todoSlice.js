import { createSlice, nanoid ,createAsyncThunk } from '@reduxjs/toolkit'
import { callOpenRouter } from "../../utils/openrouter.js";


const initialState = {
  todos: [{ id: "abc", task: "demo-task", isDone: false }],
  suggestedTask: "",
  aiSuggestionStatus: "idle",
  aiSuggestionError: ""
};
// Async thunk for AI suggestions
export const aiSuggestTodo = createAsyncThunk(
  "todo/aiSuggestTodo",
  async (_, { rejectWithValue }) => {
    const suggestion = await callOpenRouter(
      "Suggest 1 short todo task (max 8 words)."
    );
    if (!suggestion || suggestion === "AI suggestion failed") {
      return rejectWithValue("Could not fetch AI suggestion right now.");
    }
    return suggestion.trim().replace(/^["']|["']$/g, "");
  }
);

export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state, action) => {
            const newTodo = {
                id: nanoid(),
                task: action.payload,
                isDone: false
            }
            state.todos.push(newTodo);
            state.suggestedTask = "";
            state.aiSuggestionError = "";
        },
        deleteTodo: (state, action) => {
            state.todos = state.todos.filter((todo) => todo.id !== action.payload);
        },
       markDone: (state, action) => {
      state.todos = state.todos.map((todo) =>
        todo.id === action.payload ? { ...todo, isDone: true } : todo
      );
    }
  },  
 extraReducers: (builder) => {
    builder
      .addCase(aiSuggestTodo.pending, (state) => {
        state.aiSuggestionStatus = "loading";
        state.aiSuggestionError = "";
      })
      .addCase(aiSuggestTodo.fulfilled, (state, action) => {
        state.aiSuggestionStatus = "succeeded";
        state.suggestedTask = action.payload;
      })
      .addCase(aiSuggestTodo.rejected, (state, action) => {
        state.aiSuggestionStatus = "failed";
        state.aiSuggestionError =
          action.payload || action.error.message || "AI suggestion failed.";
      });
  }
});

export const { addTodo, deleteTodo, markDone } = todoSlice.actions;
export default todoSlice.reducer;