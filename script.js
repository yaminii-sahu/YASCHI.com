// ==========================
// SEARCH PRODUCTS
// ==========================

let searchInput = document.getElementById("search");

let searchButton = document.getElementById("searchButton");

let productCards = document.querySelectorAll(".card");


function searchProducts() {

    let value = searchInput.value.toLowerCase().trim();

    for (let i = 0; i < productCards.length; i++) {

        let product =
            productCards[i].innerText.toLowerCase();

        if (product.includes(value)) {

            productCards[i].style.display = "block";

        }

        else {

            productCards[i].style.display = "none";

        }

    }

}


// Search when clicking the icon

searchButton.onclick = function () {

    searchProducts();

};


// Search while typing

searchInput.onkeyup = function () {

    searchProducts();

};
// YASCHI CART


let cartCount = document.getElementById("cart-count");

// Get saved cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// Show cart count
function updateCartCount() {

    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total = total + cart[i].quantity;
    }

    if (cartCount) {
        cartCount.innerHTML = total;
    }
}

updateCartCount();



// PLUS BUTTON


let plusButtons = document.querySelectorAll(".plus");

for (let i = 0; i < plusButtons.length; i++) {

    plusButtons[i].onclick = function () {

        let quantity =
            plusButtons[i].previousElementSibling;

        let number =
            Number(quantity.innerHTML);

        number = number + 1;

        quantity.innerHTML = number;
    };
}



// MINUS BUTTON


let minusButtons = document.querySelectorAll(".minus");

for (let i = 0; i < minusButtons.length; i++) {

    minusButtons[i].onclick = function () {

        let quantity =
            minusButtons[i].nextElementSibling;

        let number =
            Number(quantity.innerHTML);

        if (number > 1) {

            number = number - 1;

            quantity.innerHTML = number;
        }
    };
}


// ADD TO CART

let cartButtons =
    document.querySelectorAll(".cart-btn");

for (let i = 0; i < cartButtons.length; i++) {

    cartButtons[i].onclick = function () {

        // Find product card
        let card =
            cartButtons[i].closest(".card");

        // Get product name
        let name =
            card.querySelector("h2").innerHTML;

        // Get price
        let priceText =
            card.querySelector(".price").innerHTML;

        let price =
            Number(priceText.replace("₹", ""));

        // Get quantity
        let quantity =
            Number(card.querySelector(".qty").innerHTML);


        // Add product to cart
        cart.push({

            name: name,

            price: price,

            quantity: quantity

        });


        // Save cart
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        // Update number
        updateCartCount();


        

    };
}



// WISHLIST


let wishButtons =
    document.querySelectorAll(".wish-btn");

for (let i = 0; i < wishButtons.length; i++) {

    wishButtons[i].onclick = function () {

        if (
            wishButtons[i].innerHTML.includes("Wishlist")
        ) {

            wishButtons[i].innerHTML = "❤ Added";

            wishButtons[i].style.background =
                "#d8b4b6";

        }

        else {

            wishButtons[i].innerHTML =
                "❤ Wishlist";

            wishButtons[i].style.background =
                "#9FB7AA";
        }
    };
}

