import { useState } from "react";
import { ChildArea } from './ChildArea';
export const RenderTracker = () => {
  console.log("RenderTracker");

  // state
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  // function
  const onChangeText = (e) => setText(e.target.value);
  const onClickOpen = () => setOpen(!open) ;

  return (
    <div>
      <input value={text} onChange={onChangeText} />
      <br />
      <br />
      <button onClick={onClickOpen}>表示</button>
      <ChildArea open="aaa" />
    </div>
  );
}