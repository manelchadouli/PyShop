// cart.js
// Function to show alert messages

document.addEventListener('DOMContentLoaded', function () {
    // Get all the "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Add click event listener to each button
    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });

    function addToCart(productId) {
        fetch(`/add_to_cart/${productId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                'product_id': productId,
                 'quantity': 1,
            }),
        })
        .then(response => response.json())
        .then(data => {
           // Display a success message
            showAlert('Product added to cart!', 'success');
        })
        .catch(error => {
            console.error('Error adding product to cart:', error);
              // Display an error message
            showAlert('Error adding product to cart. Please try again.', 'error');
        });
    }
      // Add click event listener to each "Delete" button
    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');

    removeFromCartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            removeFromCart(productId);
        });
    });

        function removeFromCart(productId) {
        fetch(`/remove_from_cart/${productId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                'product_id': productId,
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Optional: You can display a success message or update the cart view
            // Display a success message
            showAlert('Product removed from cart!', 'success');
            // If you want to update the cart view after removing the product, you can
            // reload the page or make another request to get the updated cart items.
            // If you want to update the cart view after removing the product, you can
            // reload the page or make another request to get the updated cart items.
            location.reload();
        })
        .catch(error => {
            console.error('Error removing product from cart:', error);
            // Display an error message
            showAlert('Error removing product from cart. Please try again.', 'error');
        });
    }
  function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const alertHtml = `
              <div class="alert alert-warning alert-dismissible fade show" role="alert">
       ${message}.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
        `;

        // Clear any existing alerts
        while (alertContainer.firstChild) {
            alertContainer.removeChild(alertContainer.firstChild);
        }

        // Add the new alert to the container
        alertContainer.innerHTML = alertHtml;

        // Automatically close the alert after a few seconds
        const alertElement = alertContainer.firstChild;
        if (alertElement) {
            setTimeout(function () {
                alertElement.remove();
            }, 3000);
        }
    }



    // Function to get the CSRF token cookie value
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
