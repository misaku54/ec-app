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

    const targetUser = users.find((user) => user.id === id);
    setSelectedUser(targetUser);
  },[])

  return { onSelectUser, selectedUser }
}