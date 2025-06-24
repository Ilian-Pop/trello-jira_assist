import React from "react";
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
      <p>
        {resp.split("\n").map((item, index) => (
          <React.Fragment key={index}>
            {item.charAt(0) === "," ? item.slice(1) : item}
            <br />
          </React.Fragment>
        ))}
      </p>
      <div className="inputer">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ПОВІДОМЛЕННЯ"
        />
        <button
          onClick={async () => {
            await checkAiMessage({
              value: value,
              setValue: setValue,
              Resp: resp,
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
