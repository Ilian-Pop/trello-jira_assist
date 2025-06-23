function checkLoginFunction() {
  let err = true;
  if (!localStorage.getItem("name")) {
    err = false;
  }
  if (!localStorage.getItem("lastName")) {
    err = false;
  }
  if (!localStorage.getItem("middleName")) {
    err = false;
  }
  if (!localStorage.getItem("trello")) {
    err = false;
  }
  if (!localStorage.getItem("jira")) {
    err = false;
  }
  if (!localStorage.getItem("mail")) {
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
