import axios from "axios";
import { useState } from "react"; 
import { Todo } from "./Todo";
import { TodoType } from "./types/todo";


export const Call = () => {
  const [todos, setTodos] = useState<Array<TodoType>>([]);

  const onClickFetchDate = () => {
    axios.get<Array<TodoType>>("https://jsonplaceholder.typicode.com/todos").then((res) => {
      console.log(res.data);
      setTodos(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }
  return (
    <div className="App">
      <button onClick={onClickFetchDate}>データ取得</button>
      {todos.map((todo) => (
        <Todo key={todo.id} title={todo.title} userId={todo.userId} completed={todo.completed}/>
      ))}
    </div>
  )
}

