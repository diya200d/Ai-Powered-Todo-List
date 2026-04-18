import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo,aiSuggestTodo } from "../features/todo/todoSlice";

export default function AddForm() {
    const [task, setTask] = useState("");
    const dispatch = useDispatch();
    const { suggestedTask, aiSuggestionStatus, aiSuggestionError } = useSelector(
      (state) => state.todo
    );
    const inputPlaceholder = suggestedTask || "Add a new todo...";
    const isLoadingSuggestion = aiSuggestionStatus === "loading";

    // dispatch ( 2 things- one is which reducer function will be called and
    // second is on what action the reducer function is called)
    const SubmitHandler = (e) => {
        e.preventDefault();
        const finalTask = task.trim() || suggestedTask.trim();
        if (!finalTask) return; // prevent empty todos
        dispatch(addTodo(finalTask));//dispatch(reducer(action))  reducer is addTodo and action is task
        console.log(finalTask);
        setTask("");
    }

    return(
        <div className="add-form-section">
      <form className="form-container" onSubmit={SubmitHandler}>
        <input
          type="text"
          placeholder={inputPlaceholder}
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <button
        className="ai-suggest-btn"
        onClick={() => dispatch(aiSuggestTodo())}
        disabled={isLoadingSuggestion}
      >
        {isLoadingSuggestion ? "Getting AI Suggestion..." : "AI Suggest Todo"}
      </button>

      {suggestedTask && (
        <p className="ai-message ai-message-success">
          AI suggested a task. You can edit it or type your own todo.
        </p>
      )}
      {aiSuggestionError && (
        <p className="ai-message ai-message-error">
          {aiSuggestionError} You can still add your own todo manually.
        </p>
      )}
    </div>
        
    )
}
