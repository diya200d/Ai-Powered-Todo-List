import { useDispatch, useSelector } from "react-redux";
import { deleteTodo, markDone } from "../features/todo/todoSlice";
import AddForm from "./AddForm";

export default function Todo() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todo.todos);

  return (
    <div className="todo-container">
      <h1 className="app-title">Todo List</h1>
      <AddForm />

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.isDone ? "done" : ""}`}>
            <span className={`todo-text ${todo.isDone ? "done" : ""}`}>{todo.task}</span>
            <div className="todo-actions">
              <button className="todo-btn btn-done" onClick={() => dispatch(markDone(todo.id))}>
                Done
              </button>
              <button className="todo-btn btn-delete" onClick={() => dispatch(deleteTodo(todo.id))}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
