import { useStore } from "../stores/useStore";

function InputText() {
  const text = useStore((state) => state.text);
  const setText = useStore((state) => state.setText);

  console.log("InputTextがレンダリングされた");

  return (
    <div className="bg-cyan-200 p-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p>入力したテキスト: {text}</p>
    </div>
  );
}

export default InputText;
