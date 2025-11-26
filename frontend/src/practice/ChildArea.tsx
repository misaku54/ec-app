const style = {
  width: "100%",
  hegiht: "200px",
  backgroudColor: "khaki"
};

export const ChildArea = (props) => {
  const { open } = props;
  console.log("ChildAreaがレンダリング");
  
  const data = [...Array(2000).keys()];
  data.forEach(() => {
    console.log("...");
  })
  console.log();

  return (
    <>
      {open ? (
        <div style={style}>
          <p>子コンポーネント</p>
        </div>
      ) : null}
    </>
  );
}