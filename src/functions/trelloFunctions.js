import axios from "axios";
function createTaks(props) {
  axios
    .get(
      `https://api.trello.com/1/members/me/boards?key=${
        process.env.REACT_APP_TRELLO_API_KEY
      }&token=${localStorage.getItem("trello")}`
    )
    .then((resp) => {
      for (const obj of resp.data) {
        if (obj.name.toLowerCase() === props.board.toLowerCase()) {
          axios
            .get(
              `https://api.trello.com/1/boards/${obj.id}/lists?key=${
                process.env.REACT_APP_TRELLO_API_KEY
              }&token=${localStorage.getItem("trello")}`
            )
            .then((resp) => {
              for (const obj of resp.data) {
                if (obj.name.toLowerCase() === props.list.toLowerCase()) {
                  axios
                    .post(`https://api.trello.com/1/cards`, {
                      name: props.taksName,
                      idList: obj.id,
                      key: process.env.REACT_APP_TRELLO_API_KEY,
                      token: localStorage.getItem("trello"),
                    })
                    .then((resp) => {
                      props.setResp("Картку додано успішно");
                    })
                    .catch((err) => {
                      props.setResp("Картки додано не було");
                    });
                }
              }
            })
            .catch((err) => {});
          break;
        }
      }
    })
    .catch((err) => {});
}
function createList(props) {
  axios
    .get(
      `http://api.trello.com/1/members/me/boards?key=${
        process.env.REACT_APP_TRELLO_API_KEY
      }&token=${localStorage.getItem("trello")}`
    )
    .then((resp) => {
      for (const obj of resp.data) {
        if (obj.name.toLowerCase() === props.board.toLowerCase()) {
          axios
            .post("https://api.trello.com/1/lists", {
              name: props.title,
              idBoard: obj.id,
              key: process.env.REACT_APP_TRELLO_API_KEY,
              token: localStorage.getItem("trello"),
            })
            .then((resp) => {
              axios
                .get(
                  `https://api.trello.com/1/boards/${obj.id}/lists?key=${
                    process.env.REACT_APP_TRELLO_API_KEY
                  }&token=${localStorage.getItem("trello")}`
                )
                .then((resp) => {
                  let res = resp.data.map((obj) => {
                    return obj.name + "\n";
                  });
                  props.setResp("Список додано успішно!" + "\n" + res);
                })
                .catch((err) => {});
            })
            .catch((err) => {
              props.setResp("Нажаль список додано не було");
            });
          break;
        }
      }
    });
}
function getBoards(props) {
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
}
function getListsFromName(props) {
  axios
    .get(
      `https://api.trello.com/1/members/me/boards?key=${
        process.env.REACT_APP_TRELLO_API_KEY
      }&token=${localStorage.getItem("trello")}`
    )
    .then((resp) => {
      for (const obj of resp.data) {
        if (obj.name.toLowerCase() === props.name.toLowerCase()) {
          axios
            .get(
              `https://api.trello.com/1/boards/${obj.id}/lists?key=${
                process.env.REACT_APP_TRELLO_API_KEY
              }&token=${localStorage.getItem("trello")}`
            )
            .then((resp) => {
              let res = resp.data.map((obj) => {
                return obj.name + "\n";
              });
              props.setResp(obj.name + "\n" + res);
            })
            .catch((err) => {});
          break;
        }
      }
    })
    .catch((err) => {});
}
export { getBoards, getListsFromName, createList, createTaks };
