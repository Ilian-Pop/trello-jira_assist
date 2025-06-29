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
    } else {
      setResp("Даний об'єкт відсутній");
      return false;
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
  if (boards && boards.length !== 0) {
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
  } else {
    setResp("Нема такої дошки");
    return false;
  }
}
//Функція для отримання карток
async function getCardsFromList(props) {
  try {
    const cards = await axios.get(
      `http://api.trello.com/1/lists/${props.list.id}/cards?key=${
        process.env.REACT_APP_TRELLO_API_KEY
      }&token=${localStorage.getItem("trello")}`
    );
    if (cards.data && cards.data.length !== 0) {
      return cards.data.map((item) => {
        return { name: item.name, id: item.id };
      });
    } else {
      props.setResp(props.list.name + ": пустий");
      return false;
    }
  } catch {
    props.setResp(props.list.name + ": пустий");
    return false;
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
    localStorage.setItem("list", "");
    localStorage.setItem("task", "");
  }
}
//Функція для отримання списків
async function getListsFromName(props) {
  const board = await trelloSearch(props.board, props.setResp);
  if (board && board.board) {
    const result = await getListFromBoard(board.board.id, props.setResp);
    if (result) {
      props.setResp(
        board.board.name +
          ":\n" +
          result.map((board) => {
            return board.name + "\n";
          })
      );
      localStorage.setItem("task", "");
    }
  } else {
    props.setResp("Такої дошки не існує");
  }
}
//Функція для отримання карток
async function getCards(props) {
  const board = await trelloSearch(
    await localStorage.getItem("board"),
    props.setResp
  );
  if (board) {
    const lists = await getListFromBoard(board.board.id, props.setResp);
    const list = lists.find((list) => {
      return (
        list.name.toLowerCase() ===
        localStorage.getItem("list").toLocaleLowerCase()
      );
    });
    if (list && list.length !== 0) {
      const cards = await getCardsFromList({
        setResp: props.setResp,
        list: list,
      });
      if (cards) {
        console.log(cards);
        props.setResp(
          list.name +
            ":\n" +
            cards.map((card) => {
              return card.name + "\n";
            })
        );
      }
    } else {
      props.setResp("Ви вказали неправильний список, або дошку");
    }
  }
}
async function createNewCard(setResp) {
  const board = await trelloSearch(
    await localStorage.getItem("board"),
    setResp
  );
  if (board.board) {
    const lists = await getListFromBoard(board.board.id);
    if (lists && lists.length !== 0) {
      const list = lists.find((list) => {
        return (
          list.name.toLowerCase() === localStorage.getItem("list").toLowerCase()
        );
      });
      if (list) {
        try {
          await axios.post("https://api.trello.com/1/cards", {
            idList: list.id,
            name: await localStorage.getItem("task"),
            key: process.env.REACT_APP_TRELLO_API_KEY,
            token: await localStorage.getItem("trello"),
          });
          setResp("Нову картку створено успішно");
        } catch (e) {
          setResp("Виникли проблеми");
        }
      } else {
        setResp("Нема такого списку");
      }
    }
  }
}
async function createNewList(setResp) {
  const board = await trelloSearch(
    await localStorage.getItem("board"),
    setResp
  );
  if (board.board) {
    try {
      await axios.post("https://api.trello.com/1/lists", {
        idBoard: board.board.id,
        name: await localStorage.getItem("list"),
        key: process.env.REACT_APP_TRELLO_API_KEY,
        token: await localStorage.getItem("trello"),
      });
      setResp("Список додано успішно");
    } catch (e) {
      setResp("Списку створено не було");
    }
  } else {
    setResp("Дана дошка відсутня");
  }
}
async function deleteList(setResp) {
  const board = await trelloSearch(await localStorage.getItem("board"));
  if (board.board) {
    const lists = await getListFromBoard(board.board.id, setResp);
    if (lists) {
      const list = lists.find((list) => {
        return (
          list.name.toLowerCase() === localStorage.getItem("list").toLowerCase()
        );
      });
      if (list) {
        try {
          await axios.put(
            `https://api.trello.com/1/lists/${list.id}/closed?key=${
              process.env.REACT_APP_TRELLO_API_KEY
            }&token=${localStorage.getItem("trello")}`,
            { value: true }
          );
          setResp("Список видалено успішно");
          localStorage.setItem("list", "");
          localStorage.setItem("task", "");
        } catch (e) {
          setResp("Список видалити не вдалося");
        }
      } else {
        setResp("Такого списку не існує");
        localStorage.setItem("list", "");
      }
    }
  }
}
async function deleteCard(setResp) {
  const board = await trelloSearch(localStorage.getItem("board"), setResp);
  if (board && board.board) {
    const lists = await getListFromBoard(board.board.id, setResp);
    if (lists) {
      const list = lists.find(
        (list) =>
          list.name.toLowerCase() === localStorage.getItem("list").toLowerCase()
      );
      if (list) {
        const cards = await getCardsFromList({ list: list, setResp: setResp });
        if (cards) {
          const card = await cards.find((card) => {
            return card.name.toLowerCase() === localStorage.getItem("task");
          });
          if (card) {
            try {
              axios.delete(
                `https://api.trello.com/1/cards/${card.id}?key=${
                  process.env.REACT_APP_TRELLO_API_KEY
                }&token=${localStorage.getItem("trello")}`
              );
              setResp("Картка видалена успішно");
              localStorage.setItem("task", "");
            } catch {
              setResp("Видалити картку не вдалося");
              localStorage.setItem("task", "");
            }
          } else {
            setResp("Ви ввели не валідну картку");
            localStorage.setItem("task", "");
          }
        }
      } else {
        setResp("Ви ввели невалідний список");
      }
    }
  }
}
export {
  getMyBoards,
  getListsFromName,
  createNewList,
  createNewCard,
  getCards,
  deleteList,
  deleteCard,
};
