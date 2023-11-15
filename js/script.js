("use strict");

// Varaiable declaration
const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modalTitle");
const btnUpdate = document.querySelector("#btnUpdate");
const btnCreateNewProduct = document.querySelector("#btnCreateNewProduct");
const btnCloseModal = document.querySelector("#btnCloseModal");
const btnSubmit = document.querySelector("#btnSubmit");
const cardContainer = document.querySelector("#cardContainer");
const productName = document.querySelector("#productName");
const productPrice = document.querySelector("#productPrice");
const btnFilterPrice = document.querySelector("#btnFilterPrice");
const priceFrom = document.querySelector("#filterPriceFrom");
const priceTo = document.querySelector("#filterPriceTo");
const inputFile = document.querySelector("#productImage");

let imageUrl = "";
let editingProductId = null;
let products = [
  {
    id: 1,
    name: "Apple Watch Series",
    price: 1299,
    image: "./asset/img/apple-watch.png",
  },
  {
    id: 2,
    name: "JBL Xtreme 2",
    price: 580,
    image: "./asset/img/jbl-speaker.jpg",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: 399,
    image: "./asset/img/sony_headphone.jpg",
  },
];

// This method used to render a product card
function renderCard(product) {
  return `
  <div class="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border">
  <div class="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white h-96 rounded-xl bg-clip-border">
    <img
      src="${product.image}"
      class="object-cover w-full h-full"
    />
  </div>
  <div class="p-6">
    <div class="flex items-center justify-between mb-2">
      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
        ${product.name}
      </p>
      <p class="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
        $${product.price}.00
      </p>
    </div>
    <p class="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
      With plenty of talk and listen time, voice-activated Siri access, and an
      available wireless charging case.
    </p>
  </div>
  <div class="p-6 pt-0 flex">
    <button
      class="btnRemove block w-full select-none rounded-lg bg-blue-gray-900/10 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-blue-gray-900 transition-all hover:scale-105 focus:scale-105 focus:opacity-[0.85] active:scale-100 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      type="button"
    >
      Remove
    </button>
    <button
      class="btnEdit block w-full select-none rounded-lg bg-blue-gray-900/10 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-blue-gray-900 transition-all hover:scale-105 focus:scale-105 focus:opacity-[0.85] active:scale-100 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      type="button"
      onclick="editProduct(${JSON.stringify(product.id)})"
    >
      Edit
    </button>
  </div>
</div>
  `;
}

// This method used to render all products
function renderProductList(filteredProducts) {
  cardContainer.innerHTML = "";
  const productsToRender = filteredProducts || products;

  productsToRender.forEach((product) => {
    const cardElement = document.createElement("div");
    cardElement.innerHTML = renderCard(product);
    cardContainer.appendChild(cardElement);

    const removeButton = cardElement.querySelector(".btnRemove");
    removeButton.addEventListener("click", () => removeProduct(product.id));
  });
}

// This method used to add a new product
function addNewProduct() {
  const productIds = products.map((product) => product.id);
  const newProduct = {
    id: Math.max(...productIds) + 1,
    name: productName.value,
    price: productPrice.value,
    image: imageUrl,
  };

  products.push(newProduct);
  modal.classList.add("hidden");
  renderProductList();
  clearForm();
}

// This method used to remove existing product
function removeProduct(productId) {
  const index = products.findIndex((product) => product.id === productId);
  if (index !== -1) {
    products.splice(index, 1);
    renderProductList();
  }
}

// This method used to editing product
function editProduct(productId) {
  const index = products.findIndex((p) => p.id === productId);
  modalTitle.textContent = "Update Product";
  btnSubmit.classList.add("hidden");
  btnUpdate.classList.remove("hidden");

  if (index !== -1) {
    modal.classList.remove("hidden");
    productName.value = products[index].name;
    productPrice.value = products[index].price;
    imageUrl = products[index].image;

    btnUpdate.addEventListener("click", () => {
      products[index].name = productName.value;
      products[index].price = productPrice.value;
      products[index].image = imageUrl;
      modal.classList.add("hidden");
      renderProductList();
      clearForm();
    });
  }
}

// This method used to filtering a products by price
function filterProducts() {
  const priceFromValue = parseFloat(priceFrom.value);
  const priceToValue = parseFloat(priceTo.value);

  if (!isNaN(priceFromValue) && !isNaN(priceToValue)) {
    const filteredProducts = products.filter(
      (product) =>
        product.price >= priceFromValue && product.price <= priceToValue
    );
    renderProductList(filteredProducts);
  } else {
    renderProductList();
  }
}

// This method used to clear the form fields
function clearForm() {
  productName.value = "";
  productPrice.value = "";
  inputFile.value = "";
}

// Handle open modal to create a new product
btnCreateNewProduct.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Handle colse modal
btnCloseModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Handle image input from user
inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    imageUrl = reader.result;
  });

  file ? reader.readAsDataURL(file) : alert("File has not been found..!");
});

// Handle filtering product by price
btnFilterPrice.addEventListener("click", () => {
  filterProducts();
});

// Handle create a new product
btnCreateNewProduct.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modalTitle.textContent = "Create New Product";
  btnUpdate.classList.add("hidden");
  btnSubmit.classList.remove("hidden");
  btnSubmit.addEventListener("click", addNewProduct);
});

// Initial rendering products
renderProductList();
