import axios from "axios";
import {
  getMyBoards,
  getListsFromName,
  createNewList,
  createNewCard,
} from "./trelloFunctions";
async function checkAiMessage(props) {
  let propValue = props.value;
  props.setResp("Зачекайте...");
  props.setValue("");
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  if (propValue === "") {
    props.setResp("Помоєму ви дещо забули!");
  } else {
    const ansver = await axios.get(
      `https://api.wit.ai/message?v=${year}${month}${day}&q=${propValue}`,
      {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_WIT_KEY}` },
      }
    );
    switch (ansver.data.intents[0].name) {
      case "exit":
        props.setExit(false);
        localStorage.clear();
        break;
      case "TrelloGetBoard":
        await getMyBoards(props);
        break;
      case "hello":
        props.setResp(
          `Вітаю ${localStorage.getItem("lastName")} ${localStorage.getItem(
            "name"
          )} ${localStorage.getItem("middleName")}`
        );
        break;
      case "TrelloCreateTask":
        console.log(ansver.data);
        createNewCard({
          ...props,
          board: ansver.data.entities["board:board"][0].body,
          list: ansver.data.entities["listName:listName"][0].body,
          card: ansver.data.entities["taskName:taskName"][0].body,
        });
        break;
      case "TrelloCreateList":
        createNewList({
          ...props,
          name: ansver.data.entities["board:board"][0].body,
          title: ansver.data.entities["title:title"][0].body,
        });
        break;
      case "TrelloGetLists":
        getListsFromName({
          ...props,
          name: ansver.data.entities["board:board"][0].body,
        });
        break;
      default:
        props.setExit(false);
        break;
    }
  }
}
export { checkAiMessage };
