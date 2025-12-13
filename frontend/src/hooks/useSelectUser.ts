import { useCallback, useState } from "react";
import { User } from "../types/api/user";

type Props = {
  id: number;
  users: Array<User>;
}

// ユーザーの詳細情報を取得するhooks
export const useSelectUser = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>();

  const onSelectUser = useCallback((props: Props) => {
    // console.log(props)
    const { id, users } = props;
    // console.log(id);
    // console.log(users);

    const targetUser = users.find((user) => user.id === id);
    // console.log(targetUser);
    setSelectedUser(targetUser ?? null);
  },[])

  return { onSelectUser, selectedUser }
}