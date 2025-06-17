import axios from "axios";
function checkAiMessage(props) {
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  axios
    .get(
      `https://api.wit.ai/message?v=${year}${month}${day}&q=${props.value}`,
      {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_WIT_KEY}` },
      }
    )
    .then((resp) => {
      props.setValue("");
      switch (resp.data.intents[0].name) {
        case "exit":
          props.setExit(false);
          localStorage.clear();
          break;
        case "TrelloGetBoard":
          axios
            .get(
              `https://api.trello.com/1/members/me/boards?key=${
                process.env.REACT_APP_TRELLO_API_KEY
              }&token=${localStorage.getItem("trello")}`
            )
            .then((resp) => {
              let res = resp.data.map((props1) => {
                return props1.name + "\n";
              });
              props.setResp("Ваші дошки трело \n" + res);
            })
            .catch((err) => {
              props.setResp("У вас проблеми з токеном");
            });
          break;
        case "hello":
          props.setResp(
            `Вітаю ${localStorage.getItem("name")} ${localStorage.getItem(
              "lastName"
            )} ${localStorage.getItem("middleName")}`
          );
          break;
        default:
          props.setExit(false);
          break;
      }
    })
    .catch((err) => console.log(err));
}
export { checkAiMessage };
