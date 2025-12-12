import axios from "axios";
import { useCallback, useState } from "react";
import { User } from "../types/api/user";

// APIを叩いてユーザー一覧を取得するhooks
export const useAllUser = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Array<User>>();

  const getUsers = useCallback(() => {
    // ローディング中
    setLoading(true);

    axios
      .get<Array<User>>("https://jsonplaceholder.typicode.com/users")
      .then((res) => setUsers(res.data))
      .catch(() => alert('ユーザー一覧を取得できませんでした'))
      .finally(() => setLoading(false));
  }, []);

  return { loading, users, getUsers}
}