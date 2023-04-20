const { ipcRenderer, desktopCapturer, app } = require("electron");

const XLSX = require("xlsx");
const { boolean } = require("boolean");

// Create a new XLSX file
// const newBook = XLSX.utils.book_new();
// const newSheet = XLSX.utils.json_to_sheet(worksheets.Sheet1);
// XLSX.utils.book_append_sheet(newBook, newSheet, "Sheet1");
// XLSX.writeFile(newBook,"new-book.xlsx");


let worksheets = {};
let workbook = XLSX.readFile("app.xlsx")

for (let sheetName of workbook.SheetNames) {
  worksheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

let worksheet = workbook.Sheets[workbook.SheetNames[0]]
let firstSheet = workbook.SheetNames[0];
let sheetValues = workbook.Sheets[firstSheet];
let rowsInThere = XLSX.utils.sheet_to_json(sheetValues)
let rowsLenght = rowsInThere.length + 2;


// Проверка на пустые ячейки
fillTable()

//======================== Чтение excel файла и проверка на пустые ячейки ================
function fillTable () {
  for (let i = 2; i < rowsLenght; i++) {
    let title = worksheet[`A${i}`].v
    let urlEx = worksheet[`B${i}`].v
    let userEx = worksheet[`C${i}`].v
    let emailEx = worksheet[`D${i}`].v
    let pasEx = worksheet[`E${i}`].v
    let discEx = worksheet[`F${i}`].v
    let imageEx = `images/${title}.png`


    const checkMissing = () => {
      if (title === "miss") {
        title = worksheet[`A${i}`].v =`
                                        <div class="missing">
                                          MISSING
                                        </div>
                                      `
      } else if (urlEx === "miss") {
        urlEx = worksheet[`B${i}`].v =`
                                        <div class="missing">
                                          MISSING
                                        </div>
                                      `
      } else if (userEx === "miss") {
        userEx = worksheet[`C${i}`].v =`
                                        <div class="missing">
                                          MISSING
                                        </div>
                                      `
      } else if (emailEx === "miss") {
        emailEx = worksheet[`D${i}`].v =`
                                          <div class="missing">
                                            MISSING
                                          </div>
                                        `
      } else if (pasEx === "miss") {

        pasEx = worksheet[`E${i}`].v =`MISSING`

      } else if (discEx === "miss") {
        discEx = worksheet[`F${i}`].v = ` 
                                          <div class="missing">
                                            MISSING
                                          </div>
                                        `
      }
    }
  
    checkMissing()
    pasteTable(title, userEx, urlEx, emailEx, pasEx, discEx, imageEx)
}

};
//======================== Вставка таблицы ==============================================
function pasteTable (title, userEx, urlEx, emailEx, pasEx, discEx, imageEx) {
  let createRows = document.createElement('tr');
  let pass = document.querySelector('.password-input')
  let tableCode = `
  <td>
    <div class="hide">&name&</div>
    <div class="website">
      <img src="%image%">
      <div class="website__container">
        <div class="name">%name%</div>
        <div class="url" onclick="location.href='%url%','_blank'">#url#</div>
      </div>
    </div>
  </td>
  <td>
    <div class="username">
      <div class="default__row login">%login%</div>
    </div>
  </td>
  <td>
    <div class="email">
      <div class="default__row email">%email%</div>
    </div>
  </td>
  <td class="password">
    <div class="pass_container">
      <input type="password" class="password-input" value="%password%" name="password" disabled>
    </div>
  </td>
  <td>
    <div class="discription">%discription%</div>
  </td>
  `;
  let replace = tableCode.replace('%name%', title)
                        .replace('&name&', title)
                        .replace('#url#', urlEx)
                        .replace('%url%', urlEx)
                        .replace('%login%', userEx)
                        .replace('%email%', emailEx)
                        .replace('%password%', pasEx)
                        .replace('%discription%', discEx)
                        .replace('%image%', imageEx);
  createRows.innerHTML = replace;
  ol.append(createRows);
}
//======================== Кнопка "Закрыть программу" ====================================
function windowClose() {
  ipcRenderer.send("close", "saurav");
}
//======================== Кнопка "Свернуть программу" ===================================
function minimize() {
  ipcRenderer.send("minimize", "saurav");
}


//======================== Копировать в буфер обмена по нажатию ===============================
document.addEventListener ('click', function(e){
  let target = e.target;
  if(target.classList[1] == 'login'){
    navigator.clipboard.writeText(target.innerHTML)
  } else if (target.classList[1] == 'email') {
    navigator.clipboard.writeText(target.innerHTML)
  }else if (target.classList[1] == 'view') {
    navigator.clipboard.writeText(target.value)
    console.log(target.value)
  }
  return false
})


//========================== Поиск по таблице ================================
function tableSearch(){
  let table = document.getElementById('ol')
  let search = document.getElementById('search-text')
  let regSearch = new RegExp(search.value, 'i')
  let names = document.querySelectorAll('.name')
  let flag = false
  let flag1 = false
  for (let i = 1; i < table.rows.length; i++){
    flag = false
    for (let j = table.rows[i].cells.length - 5; j >= 0; j--){
      flag = regSearch.test(table.rows[i].cells[j].innerHTML) 
        console.log('flag = ' + regSearch.test(table.rows[i].cells[j].innerHTML))
      if (flag) break
    }
    if (flag) {
      table.rows[i].style.display = ""
    } else {
      table.rows[i].style.display = "none"
    }
  }
}

//====================== Кнопка "показать/скрыть пароль" =====================
document.querySelector('.show_password').addEventListener('click', function(){
  btnShowPas = document.querySelector('.show_password')
  if (btnShowPas.innerHTML === "SHOW PASSWORD") {
    btnShowPas.innerHTML = "HIDE PASSWORD"
    btnShowPas.classList.remove ('show_password_red')
    btnShowPas.classList.add ('show_password_green')
  } else {
    btnShowPas.innerHTML = "SHOW PASSWORD"
    btnShowPas.classList.remove ("show_password_green")
    btnShowPas.classList.add ("show_password_red")
  }
})

//==================== Функционал кнопки "скрыть/показать пароль" =================================
document.querySelector('.show_password').addEventListener('click', function(){
  let input = document.querySelectorAll('.password-input');
  input.forEach(function(item, index, inputArr){
    if (item.getAttribute('type') == 'password') {
      item.classList.add('view');
      item.setAttribute('type', 'text');
      } else {
      item.classList.remove('view');
      item.setAttribute('type', 'password');
      }
      return false;
  })
})

//==================== Модальное окно успешного добавления аккаунта =====================================
function successfullyAdded(){
  document.querySelector('.successfullyAdded').style.display = "block";
  setTimeout(function(){
    document.querySelector('.successfullyAdded').style.display = 'none';
  }, 2000);
}

//============================== Очистка инпутов в модальном окне ================================
const clearInputs = () => {
  allInputs.forEach(element => {
    element.value = ""
  });
}

//==================== 
const newAccount = () => {
  clearTable()

  let account = inputAccount.value
  let site = inputSite.value
  let login = inputLogin.value
  let email = inputEmail.value
  let password = inputPassword.value
  let discription = inputDiscription.value

  worksheets.Sheet1.push({
    "Account": `${account}`,
    "Web-site": `${site}`,
    "Login": `${login}`,
    "Email": `${email}`,
    "Password": `${password}`,
    "Discription": `${discription}`,
  });
  XLSX.utils.sheet_add_json(workbook.Sheets["Sheet1"], worksheets.Sheet1)
  XLSX.writeFile(workbook, "app.xlsx");

  
  workbook = XLSX.readFile("app.xlsx")
  worksheets = {};

  
  for (sheetName of workbook.SheetNames) {
    worksheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }
  
  worksheet = workbook.Sheets[workbook.SheetNames[0]]
  firstSheet = workbook.SheetNames[0];
  sheetValues = workbook.Sheets[firstSheet];
  rowsInThere = XLSX.utils.sheet_to_json(sheetValues)
  rowsLenght = rowsInThere.length + 2;

  // successfullyAdded()
  clearInputs()
  fillTable()
}

const clearTable = () => {
  const table = document.querySelector(".table");
  table.innerHTML = '';
}

let allInputs = document.querySelectorAll('.input__modal')
let inputAccount = document.querySelector('.add__account')
let inputSite = document.querySelector('.add__site')
let inputLogin = document.querySelector('.add__login')
let inputEmail = document.querySelector('.add__email')
let inputPassword = document.querySelector('.add__password')
let inputDiscription = document.querySelector('.add__discription')

document.querySelector('.add_new_account').addEventListener('click', function(){
  let gCheck = boolean
  for (let i = 0; allInputs[i]; i++) {
    if (allInputs[i].value == "") {
      console.log("error")
      gCheck = false
      document.querySelector('.error__modal').style.display = "block"
      return
    } else {
      gCheck = true
      console.log("DONE")
      document.querySelector('.error__modal').style.display = "none"
    }
  }
  if (gCheck = true) {
    document.querySelector('.success__modal').style.display = "block"
    setTimeout(function(){
      document.querySelector('.success__modal').style.display = "none"
    }, 2000);
    newAccount()
  } else {
    return
  }
})


document.querySelector('.add_password').addEventListener('click', function(){
  document.querySelector('.password__modal').style.display = "block"
})

const closeModalAddAccount = () => {
  document.querySelector('.password__modal').style.display = "none"
}

document.querySelector('.close_new_account').addEventListener('click', function(){
  closeModalAddAccount()
  clearInputs()
  document.querySelector('.error__modal').style.display = "none"
})

