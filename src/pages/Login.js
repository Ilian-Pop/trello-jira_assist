import React, { useState } from "react";
import { setCheckLogin1 } from "../functions/checkLoginFunction";
function Login(props) {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [lastName, setLastName] = useState(
    localStorage.getItem("lastName") || ""
  );
  const [middleName, setMiddleName] = useState(
    localStorage.getItem("middleName") || ""
  );
  const [mail, setMail] = useState(localStorage.getItem("mail") || "");
  const [trello, setTrello] = useState(localStorage.getItem("trello") || "");
  const [jira, setJira] = useState(localStorage.getItem("jira") || "");
  const [first, setFirst] = useState(false);

  return (
    <div className="loginPanel">
      <input
        style={{
          borderBottom:
            !first || /^[А-ЯЇЄІҐ][а-яїєіїґ']*[а-яїєіїґ]$/.test(name)
              ? "none"
              : "1px solid red",
        }}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        placeholder="ІМ'Я"
      />
      <input
        style={{
          borderBottom:
            !first || /^[А-ЯЇЄІҐ][а-яїєіїґ']*[а-яїєіїґ]$/.test(lastName)
              ? "none"
              : "1px solid red",
        }}
        value={lastName}
        onChange={(e) => {
          setLastName(e.target.value);
        }}
        placeholder="ПРІЗВИЩЕ"
      />
      <input
        style={{
          borderBottom:
            !first || /^[А-ЯЇЄІҐ][а-яїєіїґ']*[а-яїєіїґ]$/.test(middleName)
              ? "none"
              : "1px solid red",
        }}
        value={middleName}
        onChange={(e) => {
          setMiddleName(e.target.value);
        }}
        placeholder="ПО-БАТЬКОВІ"
      />
      <input
        style={{
          borderBottom:
            !first || /^[A-Za-z0-9\-\_\.]+@gmail.com$/.test(mail)
              ? "none"
              : "1px solid red",
        }}
        value={mail}
        onChange={(e) => {
          setMail(e.target.value);
        }}
        placeholder="ЕЛЕКТРОННА-АДРЕСА"
      />
      <input
        style={{
          borderBottom: !first || trello !== "" ? "none" : "1px solid red",
        }}
        e={trello}
        onChange={(e) => {
          setTrello(e.target.value);
        }}
        placeholder="TRELLO"
      />
      <input
        style={{
          borderBottom: !first || jira !== "" ? "none" : "1px solid red",
        }}
        value={jira}
        onChange={(e) => {
          setJira(e.target.value);
        }}
        placeholder="JIRA"
      />
      <button
        onClick={() => {
          setFirst(true);
          setCheckLogin1(
            name,
            lastName,
            middleName,
            trello,
            jira,
            props.setLogin,
            mail
          );
        }}
      >
        ВХІД
      </button>
      <a href="https://trello.com/1/authorize?expiration=never&name=MyApp&scope=read,write&response_type=token&key=9196c2e8d6b5c8a260545d92801f4123">
        Отримати TRELLO token
      </a>
      <a href="https://id.atlassian.com/manage-profile/security/api-tokens">
        Отримати JIRA token
      </a>
    </div>
  );
}
export default Login;
