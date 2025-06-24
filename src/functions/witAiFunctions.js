import axios from "axios";
import {
  getMyBoards,
  getListsFromName,
  getCards,
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
    if (ansver.data.entities["platform:platform"])
      localStorage.setItem(
        "platform",
        ansver.data.entities["platform:platform"][0].body
      );
    if (ansver.data.entities["board:board"])
      localStorage.setItem(
        "board",
        ansver.data.entities["board:board"][0].body
      );
    if (ansver.data.entities["listName:listName"])
      localStorage.setItem(
        "list",
        ansver.data.entities["listName:listName"][0].body
      );
    if (ansver.data.entities["title:title"])
      localStorage.setItem(
        "title",
        ansver.data.entities["title:title"][0].body
      );
    if (ansver.data.entities["taskName:taskName"])
      localStorage.setItem(
        "task",
        ansver.data.entities["taskName:taskName"][0].body
      );
    let message = "";
    switch (ansver.data.intents[0].name) {
      case "help":
        props.setResp(`Даний бот вміє:\n
          Переглядати дошки\n
          Переглядати списки: необхідно надати назву дошки\n
          Додавати списки: необхідно надати назву дошки та назву для нового списку\n
          Додавати картки: необхідно надати назву дошки, назву списку та назву нової картки\n
          Приклал запиту:\n
          <<Додай до дошки therapy metrics список (назва списку)>>`);
        break;
      case "hello":
        props.setResp(
          `Вітаю ${await localStorage.getItem(
            "lastName"
          )} ${await localStorage.getItem("name")} ${await localStorage.getItem(
            "middleName"
          )}`
        );
        break;
      case "exit":
        props.setExit(false);
        localStorage.clear();
        break;
      case "getBoards":
        if ((await localStorage.getItem("platform")) === "trello")
          localStorage.setItem("action", "getBoards");
        else {
          props.setResp("Ваша платформа не трелло");
        }
        break;
      case "getLists":
        if ((await localStorage.getItem("platform")) === "trello")
          localStorage.setItem("action", "getBoards");
        else {
          message += "Ваша платформа не трелло\n";
        }
        if (!(await localStorage.getItem("board")))
          message += "Ви не вибрали дошку\n";
        if (message) {
          props.setResp(message);
          message = "";
        }
        localStorage.setItem("action", "getLists");
        break;
      case "getCards":
        message = "";
        if ((await localStorage.getItem("platform")) === "trello")
          localStorage.setItem("action", "getBoards");
        else {
          message += "Ваша платформа не трелло\n";
        }
        if (!(await localStorage.getItem("board")))
          message += "Ви не вибрали дошку\n";
        if (!(await localStorage.getItem("list")))
          message += "Ви не вибрали список\n";
        if (message) {
          props.setResp(message);
          message = "";
        }
        localStorage.setItem("action", "getLists");
        break;

      default:
        props.setExit(false);
        localStorage.clear();
        break;
    }
    switch (await localStorage.getItem("action")) {
      case "getBoards":
        if ((await localStorage.getItem("platform")) === "trello") {
          await getMyBoards(props.setResp);
          localStorage.setItem("action", "");
        }
        break;
      case "getLists":
        if (
          (await localStorage.getItem("platform")) === "trello" &&
          (await localStorage.getItem("board"))
        ) {
          await getListsFromName({
            setResp: props.setResp,
            board: await localStorage.getItem("board"),
          });
          localStorage.setItem("action", "");
        }
        break;
      case "getCards":
        if (
          (await localStorage.getItem("platform")) === "trello" &&
          (await localStorage.getItem("board")) &&
          (await localStorage.getItem("list"))
        ) {
          await getCards({
            setResp: props.setResp,
            board: await localStorage.getItem("board"),
            list: await localStorage.getItem("list"),
          });
          localStorage.setItem("action", "");
        }
      default:
        break;
    }
  }
}
export { checkAiMessage };
