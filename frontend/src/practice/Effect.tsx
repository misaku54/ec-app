import { useEffect, useState } from "react"

const Effect = () => {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const countUp = () => {
    setCount((prevCount) => prevCount + 1);
  }

  //第二引数に何も指定しない場合
  useEffect(() => {
    console.log("再レンダリングされるごとに実行される");
  });

  //第二引数に空の配列を指定した場合
  useEffect(() => {
    console.log("初回レンダリングで実行される");
  },[]);

  //第二引数の配列に 1 つ以上の値が指定されている場合
  useEffect(() => {
    console.log("countの値が変わるごとに実行される");
  },[count]);

  return (
    <>
      {console.log("----レンダリング----")}
      <button onClick={countUp}>+</button>
      <p>count : {count}</p>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "open" : "close"}
      </button>
    </>
  )
}