import { FC, memo, useCallback } from "react";
import { useNavigate } from "react-router";
import { Flex, Heading, Box, Link, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerBody } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";

export const Header: FC = memo(() => {
  const nagative = useNavigate();

  const onClickHome = useCallback(() => {
    nagative("/home")
  }, [nagative]);

  const onClickUserManagement = useCallback(() => {
    nagative("/home/user_management")
  }, [nagative]);

  const onClickSetting = useCallback(() => {
    nagative("/home/setting")
  }, [nagative]);
  
  return (
    <>
      <Flex
        as="nav"
        bg="teal.500"
        color="gray.50"
        align="center"
        justify="space-between"
        padding={{ base: 3, md: 5 }}
      >
        <Flex align="center" as="a" mr={8} _hover={ { cursor: "pointer"} } onClick={onClickHome}>
          <Heading as="h1" fontSize={{ base: "md", md: "lg"}} >
            ユーザー管理アプリ
          </Heading>
        </Flex>
        <Flex align="center" fontSize="sm" flexGrow={2} display={{ base: "none", md: "flex"}}>
          <Box pr={4}>
            <Link color="inherit" onClick={onClickUserManagement}>ユーザー一覧</Link>
          </Box>
          <Link color="inherit" onClick={onClickSetting}>設定</Link>
        </Flex>
        <IconButton aria-label='メニューボタン' size="sm" variant="unstyled" 
          display={{ base: "block", md: "none" }}><FaBars /></IconButton>
      </Flex>
      
    </>
  );
})