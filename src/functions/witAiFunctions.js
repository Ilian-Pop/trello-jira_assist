import axios from "axios";
import {
  getBoards,
  getListsFromName,
  createList,
  createTaks,
} from "./trelloFunctions";
function checkAiMessage(props) {
  let propValue = props.value;
  props.setValue("");
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  if (propValue === "") {
    props.setResp("Помоєму ви дещо забули!");
  } else {
    axios
      .get(
        `https://api.wit.ai/message?v=${year}${month}${day}&q=${propValue}`,
        {
          headers: { Authorization: `Bearer ${process.env.REACT_APP_WIT_KEY}` },
        }
      )
      .then((resp) => {
        switch (resp.data.intents[0].name) {
          case "exit":
            props.setExit(false);
            localStorage.clear();
            break;
          case "TrelloGetBoard":
            getBoards(props);
            break;
          case "hello":
            props.setResp(
              `Вітаю ${localStorage.getItem("lastName")} ${localStorage.getItem(
                "name"
              )} ${localStorage.getItem("middleName")}`
            );
            break;
          case "TrelloCreateTask":
            createTaks({
              ...props,
              board: resp.data.entities["board:board"][0].body,
              list: resp.data.entities["list:list"][0].body,
              taskName: resp.data.entities["name:name"][0].body,
            });
            break;
          case "TrelloCreateList":
            createList({
              ...props,
              board: resp.data.entities["board:board"][0].body,
              title: resp.data.entities["title:title"][0].body,
            });
            break;
          case "TrelloGetLists":
            getListsFromName({
              ...props,
              name: resp.data.entities["board:board"][0].body,
            });
            break;
          default:
            props.setExit(false);
            break;
        }
      })
      .catch((err) => console.log(err));
  }
}
export { checkAiMessage };
