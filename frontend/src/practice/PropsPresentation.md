# Reactのprops（プロップス）

## propsとは？
**親コンポーネントから子コンポーネントへデータを渡す仕組み**

---

## 基本の使い方

### props無し ❌
```jsx
function Header() {
  return <h1>株式会社太郎</h1>;
}
```
→ 毎回同じ内容しか表示できない

### propsあり ✅
```jsx
// 子コンポーネント：受け取る側
function Header({ companyName }) {
  return <h1>{companyName}</h1>;
}

// 親コンポーネント：渡す側
function App() {
  return (
    <>
      <Header companyName="株式会社太郎" />
      <Header companyName="株式会社花子" />
    </>
  );
}
```
→ 同じコンポーネントを使い回せる！

---

## 重要ポイント 🔑
- ✅ **親→子への一方通行**
- ✅ **読み取り専用（変更できない）**
- ✅ **文字列、数値、配列、オブジェクト、関数など何でも渡せる**

---

**propsでコンポーネントが再利用可能に！**

