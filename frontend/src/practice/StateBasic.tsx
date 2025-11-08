import { useState } from "react";

type StateBasicProps = {
  init: number
}

export const StateBasic = ({init}: StateBasicProps) => {
  const [count, setCount] = useState(init);
  const handleClick = () => setCount(count + 1);
  
  return (
    <>
      <button onClick={handleClick}>カウント</button>
      <p>{count}回クリックされました</p>
    </>
  )
}