import axios from "axios";
//Внутрішні функції
//Функція пошуку
async function trelloSearch(title, setResp) {
  try {
    const res = await axios.get(
      `http://api.trello.com/1/search?query=${title}&key=${
        process.env.REACT_APP_TRELLO_API_KEY
      }&token=${localStorage.getItem("trello")}`
    );
    if (res.data.boards) {
      return {
        board: { id: res.data.boards[0].id, name: res.data.boards[0].name },
      };
    } else if (res.data.card) {
      return {
        card: { id: res.data.cards[0].id, name: res.data.cards[0].name },
      };
    }
  } catch (e) {
    setResp("У вас проблеми з токеном");
    return false;
  }
}
//функція для отримання дощок
async function getBoards(setResp) {
  try {
    const boards = await axios.get(
      `https://api.trello.com/1/members/me/boards?key=${
        process.env.REACT_APP_TRELLO_API_KEY
      }&token=${localStorage.getItem("trello")}`
    );
    if (boards.data && boards.data.length !== 0) {
      return boards.data.map((board) => {
        return { name: board.name, id: board.id };
      });
    } else {
      setResp("У вас відсутні дошки");
      return false;
    }
  } catch (e) {
    switch (e.response.status) {
      case 401:
        setResp("У вас проблеми з токеном");
        return false;
        break;
      default:
        setResp("Невідома помилка");
        return false;
        break;
    }
  }
}
//Функція для отримання карток
async function getListFromBoard(id, setResp) {
  const boards = await getBoards(setResp);
  if (boards) {
    const board = boards.find((e) => {
      return e.id === id;
    });
    if (board) {
      try {
        const lists = await axios.get(
          `http://api.trello.com/1/boards/${board.id}/lists?key=${
            process.env.REACT_APP_TRELLO_API_KEY
          }&token=${localStorage.getItem("trello")}`
        );
        if (lists.data && lists.data.length !== 0) {
          let res = lists.data.map((list) => {
            return { name: list.name, id: list.id };
          });
          return res;
        } else {
          setResp("Списки відсутні");
        }
      } catch (e) {
        switch (e.response.status) {
          case 401:
            setResp("У вас проблеми з токеном");
            return false;
            break;
          default:
            setResp("Невідома помилка");
            return false;
            break;
        }
      }
    } else {
      return "Такої дошки неіснує";
    }
  }
}
//Функції для звязку з чатом
//Функція для отримання дощок
async function getMyBoards(setResp) {
  const boards = await getBoards(setResp);
  if (boards) {
    setResp(
      "Ваші дошки:\n" +
        boards.map((board) => {
          return board.name + "\n";
        })
    );
  }
}
//Функція для отримання списків
async function getListsFromName(props) {
  const board = await trelloSearch(props.board, props.setResp);
  if (board) {
    if (board.board.id) {
      const result = await getListFromBoard(board.board.id, props.setResp);
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
//Функція для отримання карток
async function getCards(props) {
  const board = await trelloSearch(props.board, props.setResp);
  if (board) {
    const lists = await getListFromBoard(board.id, props.setResp);
    if (lists) {
      const list = lists.find((list) => {
        return list.name.toLowerCase() === props.list.toLowerCase();
      });
      if (list) {
        const cards = await getCardsFromList({ list: list }, props.setResp);
        if (cards !== props.list + " пустий") {
          props.setResp(cards);
        } else {
          props.setResp(props.list + " пустий");
        }
      }
    }
  }
}
//Функція для створення карток
async function createNewCard(props) {
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
      } catch (e) {
        props.setResp(e.message);
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
async function getCardsFromList(props) {
  try {
    const cards = await axios.get(
      `http://api.trello.com/1/lists/${props.list.id}/cards?key=${
        process.env.REACT_APP_TRELLO_API_KEY
      }&=${localStorage.getItem("trello")}`
    );
    return cards.data.map((item) => {
      return { name: item.name, id: item.id };
    });
  } catch {
    return props.list.name + " пустий";
  }
}

export {
  getMyBoards,
  getListsFromName,
  createNewList,
  createNewCard,
  getCards,
};
