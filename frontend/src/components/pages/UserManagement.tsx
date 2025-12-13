import { Center, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useAllUsers } from "../../hooks/useAllUsers";
import { useSelectUser } from "../../hooks/useSelectUser";
import { UserCard } from "../organisms/user/UserCard";
import { UserDetailModal } from "../organisms/user/UserDetailModal";

export const UserManagement: FC = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, users, getUsers } = useAllUsers();
  const { onSelectUser, selectedUser } = useSelectUser();

  useEffect(() => {
    getUsers();
  }, []);

  const onClickUser = useCallback((id: number) => {
    onSelectUser({id, users});
    setIsOpen(true)
  },[]);
  const onClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {loading ? (
        <Center h="100vh">
          <Spinner />
        </Center>
      ) : (
        <Wrap p={{ base: 4, md: 10} }>
        {users.map((user) => (
          <WrapItem key={user.id} mx="auto">
            <UserCard id={user.id} imageUrl="https://picsum.photos/260/260" userName={user.username} fullName={user.name} onClick={onClickUser}/>
          </WrapItem>
        ))}
        </Wrap>   
      )}
      <UserDetailModal isOpen={isOpen} onClose={onClose} />
    </>
  );
})