async function checkLoginFunction() {
  let err = true;
  if (!(await localStorage.getItem("name"))) {
    err = false;
  }
  if (!(await localStorage.getItem("lastName"))) {
    err = false;
  }
  if (!(await localStorage.getItem("middleName"))) {
    err = false;
  }
  if (!(await localStorage.getItem("trello"))) {
    err = false;
  }
  if (!(await localStorage.getItem("jira"))) {
    err = false;
  }
  if (!(await localStorage.getItem("mail"))) {
    err = false;
  }
  return err;
}
function setCheckLogin1(
  name,
  lastName,
  middleName,
  trello,
  jira,
  setLogin,
  mail
) {
  let err = false;
  if (/^[А-ЯЇЄІҐ][а-яїєіїґ']*[а-яїєіїґ]$/.test(name)) {
    localStorage.setItem("name", name);
  } else {
    err = true;
  }
  if (/^[А-ЯЇЄІҐ][а-яїєіїґ']*[а-яїєіїґ]$/.test(lastName)) {
    localStorage.setItem("lastName", lastName);
  } else {
    err = true;
  }
  if (/^[А-ЯЇЄІҐ][а-яїєіїґ']*[а-яїєіїґ]$/.test(middleName)) {
    localStorage.setItem("middleName", middleName);
  } else {
    err = true;
  }
  if (trello) {
    localStorage.setItem("trello", trello);
  } else {
    err = true;
  }
  if (jira) {
    localStorage.setItem("jira", jira);
  } else {
    err = true;
  }
  if (/^[A-Za-z0-9\-\_\.]+@gmail.com$/.test(mail)) {
    localStorage.setItem("mail", mail);
  } else {
    err = true;
  }
  if (err === false) {
    setLogin(true);
  }
}
function setExit(e) {
  localStorage.clear();
  e(false);
}
export { checkLoginFunction, setCheckLogin1, setExit };
