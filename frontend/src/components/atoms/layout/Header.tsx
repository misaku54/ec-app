import { Link } from "react-router";
import { styled } from "styled-components";

export const Header = () => {
  return (
    <SHeader>
      <Link to="/">HOME</Link>
      <Link to="/users">USERS</Link>
    </SHeader>
  )
}

const SHeader = styled.header`
  background-color: #11999e;
  color: #fff;
  text-align: center;
  padding: 8px 0;
`
const SLink = styled(Link)`
  margin: 0 8px;
`