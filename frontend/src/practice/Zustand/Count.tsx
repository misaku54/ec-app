import { create } from "zustand";

interface CounterState {
  count: number;
  increase: () => void;
  decrease: () => void;
}

// カウントを管理するストアの作成
const useCounterStore = create<CounterState>()((set) => ({
  count: 0, // 初期値
  increase: () => set((state) => ({ count: state.count + 1 })), // カウントを1増やすset関数
  decrease: () => set((state) => ({ count: state.count - 1 })), // カウントを1増やすset関数
}));

function Counter() {
  // const state = useCounterStore(); すべての状態を取得して管理する（非推奨
  const count = useCounterStore((state) => state.count); // 現在のカウントを取得
  const increase = useCounterStore((state) => state.increase); // カウント増加関数を取得
  const decrease = useCounterStore((state) => state.decrease); // カウント減少関数を取得

  return (
    <div>
      <h1>カウント:{count}</h1>
      <button onClick={increase}>+1</button>
      <button onClick={decrease}>-1</button>
    </div>
  );
}

// contextと違ってstoreをexportすればどこからでも扱える。Providerで囲む必要なし
export default Counter;
