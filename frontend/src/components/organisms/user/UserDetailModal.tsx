import { CloseButton, DialogBackdrop, DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogPositioner, DialogRoot, Input, Stack } from "@chakra-ui/react";
import { FC, memo } from "react";
import { User } from "../../../types/api/user";

type Props = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailModal:FC<Props> = memo((props) => {
  const { user, isOpen, onClose } = props;
  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogHeader>ユーザー詳細</DialogHeader>
          <DialogCloseTrigger asChild>
            <CloseButton position="absolute" top={2} right={2} />
          </DialogCloseTrigger>
          <DialogBody>
            <Stack>
              {/* オプショナルチェイン */}
              <div>
                <label>名前</label>
                <Input value={user?.username} readOnly />
              </div>
              <div>
                <label>フルネーム</label>
                <Input value={user?.name} readOnly />
              </div>
              <div>
                <label>メール</label>
                <Input value={user?.email} readOnly />
              </div>
              <div>
                <label>電話番号</label>
                <Input value={user?.phone} readOnly />
              </div>
            </Stack>
          </DialogBody>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
})