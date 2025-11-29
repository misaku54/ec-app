import { TodoType } from "./types/todo";

export const Todo = (props: Pick<TodoType, "userId" | "title" | "completed">) => {
  const { title, userId, completed = false } = props;
  const compleateMark = completed ? "[完]" : "[未]";
  return <p>{`${compleateMark} ${title}(ユーザー：${userId})`}</p>
}