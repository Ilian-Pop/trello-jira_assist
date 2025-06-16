import axios from "axios";
function checkAiMessage(props) {
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  axios
    .get(
      `https://api.wit.ai/message?v=${year}${month}${day}&q=${encodeURIComponent(
        props.e
      )}`,
      {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_WIT_KEY}` },
      }
    )
    .then((resp) => {
      props.setResp(`${props.resp} \n ${resp.data.intents[0].name}`);
      props.setValue("");
      if (resp.data.intents[0].name === "exit") {
        props.setExit(false);
        localStorage.clear();
      }
    })
    .catch((err) => console.log(err));
}
export { checkAiMessage };
