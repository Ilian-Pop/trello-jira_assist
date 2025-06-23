import axios from "axios";
async function createNewCard(props) {
  console.log(props);
  const board = await trelloSearch(props.board);
  if (board.board) {
    const lists = await getListFromBoard(board.board.id);
    const list = lists.find((list) => {
      return list.name.toLowerCase() === props.list.toLowerCase();
    });
    if (list) {
      try {
        await axios.post("https://api.trello.com/1/cards", {
          idList: list.id,
          name: props.card,
          key: process.env.REACT_APP_TRELLO_API_KEY,
          token: localStorage.getItem("trello"),
        });
        props.setResp("Картку додано успішно");
      } catch {
        props.setResp("Проблеми з токеном");
      }
    } else {
      props.setResp("Нема такого списку");
    }
  } else {
    props.setResp("Нема такої дошки");
  }
}
async function createNewList(props) {
  const board = await trelloSearch(props.name);
  if (board !== "У вас проблеми з токеном") {
    if (board.board) {
      try {
        await axios.post("https://api.trello.com/1/lists", {
          name: props.title,
          idBoard: board.board.id,
          key: process.env.REACT_APP_TRELLO_API_KEY,
          token: localStorage.getItem("trello"),
        });
        const res = await getListFromBoard(board.board.id);
        props.setResp(
          board.board.name +
            ":\n" +
            res.map((list) => {
              return list.name + "\n";
            })
        );
      } catch {
        props.setResp("Сталася критична помилка");
      }
    } else {
      props.setResp("Нема такої дошки");
    }
  } else {
    props.setResp(board);
  }
}
async function trelloSearch(title) {
  try {
    const res = await axios.get(
      `http://api.trello.com/1/search?query=${title}&key=${
        process.env.REACT_APP_TRELLO_API_KEY
      }&token=${localStorage.getItem("trello")}`
    );
    if (res.data.boards[0].id) {
      return {
        board: { id: res.data.boards[0].id, name: res.data.boards[0].name },
      };
    } else if (res.data.card[0].id) {
      return {
        card: { id: res.data.cards[0].id, name: res.data.cards[0].name },
      };
    }
  } catch {
    return "У вас проблеми з токеном";
  }
}
async function getBoards() {
  try {
    const boards = await axios.get(
      `https://api.trello.com/1/members/me/boards?key=${
        process.env.REACT_APP_TRELLO_API_KEY
      }&token=${localStorage.getItem("trello")}`
    );
    return boards.data.map((board) => {
      return { name: board.name, id: board.id };
    });
  } catch {
    return "У вас проблеми з токеном";
  }
}
async function getListFromBoard(id) {
  const boards = await getBoards();
  const board = boards.find((e) => {
    return e.id === id;
  });
  if (board) {
    const lists = await axios.get(
      `http://api.trello.com/1/boards/${board.id}/lists?key=${
        process.env.REACT_APP_TRELLO_API_KEY
      }&token=${localStorage.getItem("trello")}`
    );
    let res = lists.data.map((list) => {
      return { name: list.name, id: list.id };
    });
    return res;
  } else {
    return "Такої дошки неіснує";
  }
}
async function getMyBoards(props) {
  const boards = await getBoards();
  if (boards === "У вас проблеми з токеном") {
    props.setResp(boards);
  } else {
    props.setResp(
      "Ваші дошки:\n" +
        boards.map((board) => {
          return board.name + "\n";
        })
    );
  }
}
async function getListsFromName(props) {
  const board = await trelloSearch(props.name);
  if (board !== "У вас проблеми з токеном") {
    if (board.board.id) {
      const result = await getListFromBoard(board.board.id);
      props.setResp(
        board.board.name +
          "\n" +
          result.map((board) => {
            return board.name + "\n";
          })
      );
    } else {
      props.setResp("Такої дошки не існує");
    }
  } else {
    props.setResp(board);
  }
}
export { getMyBoards, getListsFromName, createNewList, createNewCard };
