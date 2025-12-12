import { Center, DialogBackdrop, DialogBody, DialogContent, DialogPositioner, DialogRoot, Spinner, Wrap, WrapItem } from "@chakra-ui/react";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { useAllUsers } from "../../hooks/useAllUsers";
import { UserCard } from "../organisms/user/UserCard";

export const UserManagement: FC = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, users, getUsers } = useAllUsers();

  useEffect(() => {
    getUsers();
  }, []);

  const onClickUser = useCallback(() => setIsOpen(true),[]);

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
            <UserCard imageUrl="https://picsum.photos/260/260" userName={user.username} fullName={user.name} onClick={onClickUser}/>
          </WrapItem>
        ))}
        </Wrap>   
      )}
      <DialogRoot open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogBody>
            <p>テスト</p>
          </DialogBody>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
    </>
  );
})