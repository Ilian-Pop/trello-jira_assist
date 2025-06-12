function checkLoginFunction(){
    let err = true;
    if(!localStorage.getItem('name')){
        err = false
    }
    if(!localStorage.getItem('lastName')){
        err = false
    }
    if(!localStorage.getItem('middleName')){
        err = false
    }
    if(!localStorage.getItem('trello')){
        err = false
    }
    if(!localStorage.getItem('jira')){
        err = false
    }
    return err;
}
export default checkLoginFunction;