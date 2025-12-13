import axios from "axios";
import { useCallback, useState } from "react";
import { User } from "../types/api/user";

type Props = {
  id: number;
  users: Array<User>;
}

// ユーザーの詳細情報を取得するhooks
export const useSelectUser = () => {
  const [selectedUser, setSelectedUser] = useState<User>();

  const onSelectUser = useCallback((props: Props) => {
    const { id, users } = props;

    axios
      .get<User>("https://jsonplaceholder.typicode.com/users/1")
      .then((res) => setSelectedUser(res.data))
      .catch(() => alert('ユーザーを取得できませんでした。'))
      .finally(() => )


  },[])
}