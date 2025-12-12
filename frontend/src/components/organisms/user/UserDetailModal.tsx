import { CloseButton, DialogBackdrop, DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogPositioner, DialogRoot, Input, Stack } from "@chakra-ui/react";
import { FC, memo } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailModal:FC<Props> = memo((props) => {
  const { isOpen, onClose } = props;
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
              <div>
                <label>名前</label>
                <Input value="ユーザー名" readOnly />
              </div>
              <div>
                <label>フルネーム</label>
                <Input value="フルネーム" readOnly />
              </div>
              <div>
                <label>メール</label>
                <Input value="email@example.com" readOnly />
              </div>
              <div>
                <label>電話番号</label>
                <Input value="000-0000-0000" readOnly />
              </div>
            </Stack>
          </DialogBody>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
})