import { useStore } from "../stores/useStore";

function Counter() {
  const count = useStore((state) => state.count);
  const increase = useStore((state) => state.increase);
  const decrease = useStore((state) => state.decrease);

  console.log("Counterがレンダリングされた");

  return (
    <div className="bg-rose-200 p-6">
      <h1>カウント：{count}</h1>
      <button onClick={increase}>+1</button>
      <button onClick={decrease}>-1</button>
    </div>
  );
}

export default Counter;
