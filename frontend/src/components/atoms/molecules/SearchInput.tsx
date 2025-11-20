import { PrimaryButton } from "../button/PrimaryButton";
import { styled } from "styled-components";
import { Input } from "../input/Input";

export const SearchInput = () => {
  return (
    <SContainer>
      <Input placeholder="検索条件を入力してください"/>
      <SButtonWrapper>
        <PrimaryButton>ボタン</PrimaryButton>
      </SButtonWrapper>
    </SContainer>
  ); 
}

const SContainer = styled.div`
  display: flex;
  align-items: center;
`

const SButtonWrapper = styled.div`
  padding-left: 8px;
`