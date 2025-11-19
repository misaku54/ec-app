import { useParams } from "react-router";

export const UrlParameter = () => {
  let param = useParams();
  return (
    <div>
      <h1>UrlParameter</h1>
      <p>指定されたidは{param.id}です</p>
    </div>
  );
}