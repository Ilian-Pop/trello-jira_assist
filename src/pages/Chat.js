import { useState } from "react";
import { checkAiMessage } from "../functions/witAiFunctions";
function Chat(props) {
  const [value, setValue] = useState("");
  const [resp, setResp] = useState(
    "Вітаю " +
      localStorage.getItem("lastName") +
      " " +
      localStorage.getItem("name") +
      " " +
      localStorage.getItem("middleName") +
      "!"
  );
  return (
    <div className="osnova">
      <p>{resp}</p>
      <div className="inputer">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ПОВІДОМЛЕННЯ"
        />
        <button
          onClick={() => {
            checkAiMessage({
              value: value,
              setValue: setValue,
              resp: resp,
              setResp: setResp,
              setExit: props.setLogin,
            });
          }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
export default Chat;
