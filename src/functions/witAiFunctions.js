import axios from "axios";
import {
  getMyBoards,
  getListsFromName,
  getCards,
  createNewList,
  createNewCard,
  deleteList,
  deleteCard,
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
    try {
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
      if (ansver.data.entities["card:card"])
        localStorage.setItem("card", ansver.data.entities["card:card"][0].body);
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
          Працювати з платформатми трелло та джира: необхідно нвибрати платформу\n
          Переглядати розміщення\n
          Переглядати дошки\n
          Переглядати списки: необхідно надати назву дошки\n
          Додавати списки: необхідно надати назву дошки та назву для нового списку\n
          Додавати картки: необхідно надати назву дошки, назву списку та назву нової картки\n
          Видаляти списки: необхідно надати назву дошки та назву списку\n
          Видаляти картки: необхідно надати назву дошки, назву списку та назву картки\n
          `);
          break;
        case "hello":
          props.setResp(
            `Вітаю ${await localStorage.getItem(
              "lastName"
            )} ${await localStorage.getItem(
              "name"
            )} ${await localStorage.getItem("middleName")}`
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
        case "trello":
          localStorage.setItem("platform", "trello");
          props.setResp("Ви вибрали платформу trello");
          break;
        case "jira":
          localStorage.setItem("platform", "jira");
          props.setResp("Ви вибрали платформу jira");
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
          localStorage.setItem("action", "getCards");
          break;
        case "createList":
          message = "";
          if ((await localStorage.getItem("platform")) === "trello")
            localStorage.setItem("action", "getBoards");
          else {
            message += "Ваша платформа не трелло\n";
          }
          if (!(await localStorage.getItem("board")))
            message += "Ви не вибрали дошку\n";
          if (!(await ansver.data.entities["listName:listName"]))
            message += "Ви не ввели назви списку\n";
          if (message) {
            props.setResp(message);
            message = "";
          }
          localStorage.setItem("action", "createList");
          break;
        case "createTask":
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
          if (!(await ansver.data.entities["taskName:taskName"]))
            message += "Ви не ввели назви картки\n";
          if (message) {
            props.setResp(message);
            message = "";
          }
          localStorage.setItem("action", "createCard");
          break;
        case "deleteList":
          message = "";
          if (!(await localStorage.getItem("board")))
            message += "Ви не вибрали дошку\n";
          if (!(await localStorage.getItem("list")))
            message += "Ви не вибрали список\n";
          if (message) {
            props.setResp(message);
            message = "";
          }
          localStorage.setItem("action", "deleteList");
          break;
        case "deleteCard":
          message = "";
          if (!localStorage.getItem("board"))
            message += "Ви не вибрали дошку\n";
          if (!localStorage.getItem("list"))
            message += "Ви не вибрали список\n";
          if (!localStorage.getItem("task"))
            message += "Ви не вибрали картку\n";
          if (message) {
            props.setResp(message);
            message = "";
          }
          localStorage.setItem("action", "deleteCard");
          break;
        case "position":
          localStorage.setItem("action", "getPosition");
          break;
        default:
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
          break;
        case "createList":
          if (
            (await localStorage.getItem("platform")) === "trello" &&
            (await localStorage.getItem("board")) &&
            ansver.data.entities["listName:listName"]
          ) {
            await createNewList(props.setResp);
            localStorage.setItem("action", "");
          }
          break;
        case "createCard":
          if (
            (await localStorage.getItem("platform")) === "trello" &&
            (await localStorage.getItem("board")) &&
            (await localStorage.getItem("list")) &&
            ansver.data.entities["taskName:taskName"]
          ) {
            await createNewCard(props.setResp);
            localStorage.setItem("action", "");
          }
          break;
        case "deleteList":
          if (
            (await localStorage.getItem("platform")) === "trello" &&
            (await localStorage.getItem("board")) &&
            (await localStorage.getItem("list"))
          ) {
            await deleteList(props.setResp);
            localStorage.setItem("action", "");
          }
          break;
        case "deleteCard":
          if (
            (await localStorage.getItem("platform")) === "trello" &&
            (await localStorage.getItem("board")) &&
            (await localStorage.getItem("list")) &&
            (await localStorage.getItem("task"))
          ) {
            await deleteCard(props.setResp);
            localStorage.setItem("action", "");
          }
          break;
        case "getPosition":
          message = "";
          if ((await localStorage.getItem("platform")) === "trello") {
            message += "trello\\";
            if (await localStorage.getItem("board")) {
              message += (await localStorage.getItem("board")) + "\\";
              if (await localStorage.getItem("list")) {
                message += (await localStorage.getItem("list")) + "\\";
                if (await localStorage.getItem("task")) {
                  message += (await localStorage.getItem("task")) + "\\";
                }
              }
            }
          } else {
            message += "jira";
          }
          props.setResp(message);
          message = "";
          break;
        default:
          break;
      }
    } catch {
      props.setResp("Команду не розпізнано");
    }
  }
}
export { checkAiMessage };
