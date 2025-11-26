type EventBasicProps = {
  type: string;
};

export const EventBasic = ({type}: EventBasicProps) => {
  const current = () => {
    const d = new Date();

    switch(type) {
      case `date`:
        console.log(d.toLocaleDateString());
        break;
      case `time`:
        console.log(d.toLocaleTimeString());
        break;
      default:
        console.log(d.toLocaleString());
        break;
    }
  };

  return (
    <div>
      <button onClick={current}>現在時刻を取得</button>
    </div>
  )
}