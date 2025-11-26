import { useParams, useLocation } from "react-router";

export const UrlParameter = () => {
  const param = useParams();
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  console.log(search);
  console.log(query);

  return (
    <div>
      <h1>UrlParameter</h1>
      <p>パスパラメーターidは{param.id}です</p>
      <p>クエリパラメーターは{query.get("hoge")}です</p>
    </div>
  );
}