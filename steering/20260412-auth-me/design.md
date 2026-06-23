# ログイン後 `api/me` による画面制御 実装計画

## 背景・目的

現状はログイン成功後に `/admin/product/list` へ単純にリダイレクトしているだけで、
FE 側にログイン状態・ユーザー情報を保持する仕組みがない。

`GET /api/me` は既に BE 側に実装済み（セッション Cookie 認証）。
これを活用して以下を実現する。

- ログイン後にユーザー情報（id / email / roles）を取得し Context で保持
- 未認証状態でのルートアクセスをブロックし、ログイン画面へリダイレクト
- ユーザー情報をもとに Header などの画面制御に使えるようにする

---

## 現状の構成

```
frontend/src/
├── api/
│   └── ApiClient.ts         # axios インスタンス（withCredentials: true）
├── context/
│   └── AuthContext.tsx       # 現状は空のプレースホルダー
├── hooks/
│   ├── useLogin.ts           # POST /login → navigate("/admin/product/list")
│   └── useAxios.ts           # axios ラッパーフック
├── router/
│   └── Router.tsx            # ルート定義（認証保護なし）
├── App.tsx                  # BrowserRouter + Router のみ
└── components/
    ├── pages/Login.tsx
    └── templates/DefaultLayout.tsx
```

---

## 実装方針

### 1. `types/Me.ts` — Me 型の定義

```ts
export type Me = {
  id: number;
  email: string;
  roles: string[];
};
```

---

### 2. `context/AuthContext.tsx` — 認証状態管理

**状態**

| 変数 | 型 | 説明 |
|---|---|---|
| `me` | `Me \| null` | ログイン中ユーザー情報。未ログインは `null` |
| `isAuthChecked` | `boolean` | 初回 `/api/me` チェック完了フラグ（ローディング制御用） |

**提供する関数**

| 関数 | 説明 |
|---|---|
| `fetchMe()` | `GET /api/me` を呼び `me` を更新する。401 なら `null` をセット |
| `clearMe()` | ログアウト時に `me` を `null` にリセット |

**初回ロード**  
`useEffect` でマウント時に `fetchMe()` を呼ぶ。  
→ リロードしてもセッション Cookie が有効であればログイン維持できる。

```tsx
// イメージ
const AuthProvider = ({ children }) => {
  const [me, setMe] = useState<Me | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const fetchMe = async () => {
    try {
      const res = await ApiClient.get<Me>("/api/me");
      setMe(res.data);
    } catch {
      setMe(null);
    } finally {
      setIsAuthChecked(true);
    }
  };

  const clearMe = () => setMe(null);

  useEffect(() => { fetchMe(); }, []);

  return (
    <AuthContext.Provider value={{ me, isAuthChecked, fetchMe, clearMe }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### 3. `components/router/PrivateRoute.tsx` — 認証ガード

- `isAuthChecked` が `false` の間は `<Loader />` を表示（チラつき防止）
- `me === null` なら `<Navigate to="/" replace />` でログイン画面へ
- 認証済みなら `<Outlet />` で子ルートを描画

```tsx
const PrivateRoute = () => {
  const { me, isAuthChecked } = useAuth();
  if (!isAuthChecked) return <Loader />;
  return me ? <Outlet /> : <Navigate to="/" replace />;
};
```

---

### 4. `router/Router.tsx` — ルート保護の追加

```tsx
<Routes>
  <Route path="/" element={<Login />} />
  <Route element={<PrivateRoute />}>           // ← 追加
    <Route path="/admin/product" element={<DefaultLayout />}>
      <Route path="list" element={<ProductManegement />} />
      <Route path=":id" element={<ProductDetail />} />
    </Route>
  </Route>
  <Route path="*" element={<div>404</div>} />
</Routes>
```

---

### 5. `hooks/useLogin.ts` — ログイン後に `fetchMe` を呼ぶ

```ts
const login = (data: LoginInput) => {
  axiosInstance.post("/login", data)
    .then(async () => {
      await fetchMe();               // me を取得してから
      navigate("/admin/product/list"); // 遷移
    })
    .catch(...);
};
```

---

### 6. `App.tsx` — `AuthProvider` で包む

```tsx
<BrowserRouter>
  <AuthProvider>
    <Router />
  </AuthProvider>
</BrowserRouter>
```

---

## 変更ファイル一覧

| ファイル | 対応 |
|---|---|
| `src/types/Me.ts` | **新規** Me 型定義 |
| `src/context/AuthContext.tsx` | **変更** AuthProvider・useAuth の実装 |
| `src/components/router/PrivateRoute.tsx` | **新規** 認証ガードコンポーネント |
| `src/router/Router.tsx` | **変更** PrivateRoute でラップ |
| `src/hooks/useLogin.ts` | **変更** ログイン後に fetchMe を呼ぶ |
| `src/App.tsx` | **変更** AuthProvider を追加 |

---

## 考慮事項・TODO

- [ ] ロール（`ADMIN` / `USER`）によるルート分岐が必要になった場合は `PrivateRoute` に `requiredRole` props を追加する
- [ ] `Header` にログイン中メールアドレス表示・ログアウトボタンを追加する場合は `useAuth()` から `me` / `clearMe` を参照する
- [ ] ログアウトは `POST /logout` 後に `clearMe()` を呼び `navigate("/")` する
- [ ] useAxios の interceptors が同一インスタンスに重複登録される問題は別途対応が必要
