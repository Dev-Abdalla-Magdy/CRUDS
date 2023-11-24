/***************************/
/********** CRUDS **********/
/***************************/

/* Start Setup All Variables */
let allInputs = document.querySelectorAll('input');
let body = document.body;
let crudsApp = document.querySelector('.cruds');
let headSection = document.querySelector('.head');
let headTitle = document.querySelector('.title');
let headGreet = document.querySelector('.greet');
let btnMode = document.getElementById('btn-mode');
let tableContainer = document.querySelector('table');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let createBtn = document.getElementById('create-btn');
let name = document.getElementById('name');
let count = document.getElementById('count');
let category = document.getElementById('category');
let search = document.getElementById('search');
let searchTitleBtn = document.getElementById('search-title');
let searchCategoryBtn = document.getElementById('search-category');
let dataProducts = [];
let mood = 'create';
let temp;
/* End Setup All Variables */

/* Start Dark Mode Button */
btnMode.addEventListener('click', changeMode);

function changeMode(){
  crudsApp.classList.toggle('cruds-mode');
  headTitle.classList.toggle('title-mode');
  tableContainer.classList.toggle('table-mode');
  btnMode.classList.toggle('btn-toggled');
  allInputs.forEach(e=>{
    e.classList.toggle('input-toggled');
  })
}
/* End Dark Mode Button */

/* getTotal Function Declaration */
function getTotal() {
  // check price input is empty or not
  if (price.value !== '')
  {
    let result = (+price.value + +taxes.value + +ads.value - +discount.value);
    total.innerHTML = result;
    total.style.background = '#129912'
  }
  else
  {
    total.innerHTML = '';
    total.style.background = '#f11616'
  }
}

/* create element */
createBtn.addEventListener('click', createProduct);

/* check if local storage is empty or fill */
if (localStorage.products !== null)
{
  dataProducts = JSON.parse(localStorage.products);
}
else
{
  dataProducts = [];
}

/* store data in array */
function createProduct() {
  getTotal();
  let newProduct = {
    name: name.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase()
  }

  if (mood === 'create')
  {
    if
    (name.value 
    && price.value && taxes.value
    && ads.value && count.value
    && category.value && newProduct.count <= 100)
    {
      getTotal();
      if (newProduct.count > 1) {
        for (let i = 0; i < newProduct.count; i++) {
          dataProducts.push(newProduct);
        }
      }
      else{
        dataProducts.push(newProduct);
      }
      clearInputs();
    }
    else {
      alert('missing inputs');
    }
  }
  else
  {
    getTotal();
    dataProducts[temp] = newProduct;
    createBtn.innerHTML = 'Create';
    count.style.display = 'block';
    mood = 'create';
  }

  localStorage.setItem('products', JSON.stringify(dataProducts));

  showData();
}

/* clear inputs function */
function clearInputs() {
  name.value = '';
  price.value = '';
  taxes.value = '';
  ads.value = '';
  discount.value = '';
  total.innerHTML = '';
  count.value = '';
  category.value = '';
}

/* show Data function */
function showData() {
  getTotal();
  let tbody = document.getElementById('tbody');
  let table = '';
  
  for (let i = 0; i < dataProducts.length; i++)
  {
    table += `
    <tr>
      <td>${[i+1]}</td>
      <td>${dataProducts[i].name}</td>
      <td>${dataProducts[i].price}</td>
      <td>${dataProducts[i].taxes}</td>
      <td>${dataProducts[i].ads}</td>
      <td>${dataProducts[i].discount}</td>
      <td>${dataProducts[i].total}</td>
      <td>${dataProducts[i].category}</td>
      <td><button onclick="updateProduct(${i})" id="update">update</button></td>
      <td><button onclick="deleteProduct(${i})" id="delete">delete</button></td>
      </tr>
      `;
    }
    tbody.innerHTML = table;

    let deleteAllDiv = document.getElementById('delete-all-div')
    if (dataProducts.length > 0)
    {
      deleteAllDiv.innerHTML = `
      <button onclick="deleteAll()" id="delete-all-btn">
        Delete All (${dataProducts.length})
      </button>`;
    }
    else
    {
      deleteAllDiv.innerHTML = '';
    }
}
showData();

/* delete function */
function deleteProduct(i) {
  dataProducts.splice(i, 1);
  localStorage.setItem('products', JSON.stringify(dataProducts));
  showData();
}

/* deleteAll function */
function deleteAll() {
  dataProducts.splice(0);
  localStorage.clear();
  showData();
}

/* update function */
function updateProduct(i) {
  name.value = dataProducts[i].name;
  price.value = dataProducts[i].price;
  taxes.value = dataProducts[i].taxes;
  ads.value = dataProducts[i].ads;
  discount.value = dataProducts[i].discount;
  getTotal();
  mood = 'update';
  count.style.display = 'none';
  createBtn.innerHTML = 'Update';
  scroll({
    top: 0,
    behavior: 'smooth',
  });
  temp = i;
}

let searchMood = 'title';

function searchBtn(id) {
  
  if (id === 'search-title') {
    searchMood = 'title';
  } else {
    searchMood = 'category';
  }
  search.placeholder = 'Search By ' + searchMood;
  search.focus();
  search.value = '';
  showData();
}

function searchData(value) {
  let tbody = document.getElementById('tbody');
  let table = '';

  for(let i = 0; i < dataProducts.length; i++){
    if (searchMood === 'title') {
      if(dataProducts[i].name.includes(value.toLowerCase())){
        table += `
          <tr>
            <td>${[i+1]}</td>
            <td>${dataProducts[i].name}</td>
            <td>${dataProducts[i].price}</td>
            <td>${dataProducts[i].taxes}</td>
            <td>${dataProducts[i].ads}</td>
            <td>${dataProducts[i].discount}</td>
            <td>${dataProducts[i].total}</td>
            <td>${dataProducts[i].category}</td>
            <td><button onclick="updateProduct(${i})" id="update">update</button></td>
            <td><button onclick="deleteProduct(${i})" id="delete">delete</button></td>
          </tr>
        `;
      }
    }
    else {
      if(dataProducts[i].category.includes(value.toLowerCase())){
        table += `
        <tr>
        <td>${[i+1]}</td>
            <td>${dataProducts[i].name}</td>
            <td>${dataProducts[i].price}</td>
            <td>${dataProducts[i].taxes}</td>
            <td>${dataProducts[i].ads}</td>
            <td>${dataProducts[i].discount}</td>
            <td>${dataProducts[i].total}</td>
            <td>${dataProducts[i].category}</td>
            <td><button onclick="updateProduct(${i})" id="update">update</button></td>
            <td><button onclick="deleteProduct(${i})" id="delete">delete</button></td>
          </tr>
        `;
      }
    }
  }

  tbody.innerHTML = table;
}