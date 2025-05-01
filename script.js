document.addEventListener('DOMContentLoaded', function() {
    const cart = {
        items: [],
        total: 0,
        
        addItem: function(productId, productName, productPrice) {
            const existingItem = this.items.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            
            this.updateTotal();
            this.renderCart();
        },
        
        removeItem: function(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.updateTotal();
            this.renderCart();
        },
        
        clearCart: function() {
            this.items = [];
            this.total = 0;
            this.renderCart();
        },
        
        updateTotal: function() {
            this.total = this.items.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);
        },
        
        incrementQuantity: function(productId) {
            const item = this.items.find(item => item.id === productId);
            if (item) {
                item.quantity += 1;
                this.updateTotal();
                this.renderCart();
            }
        },

        decrementQuantity: function(productId) {
            const item = this.items.find(item => item.id === productId);
            if (item) {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    this.removeItem(productId);
                } else {
                    this.updateTotal();
                    this.renderCart();
                }
            }
        },

        updateQuantity: function(productId, newQuantity) {
            const item = this.items.find(item => item.id === productId);
            if (item && newQuantity > 0) {
                item.quantity = parseInt(newQuantity);
                this.updateTotal();
                this.renderCart();
            }
        },
        
        renderCart: function() {
            const cartItemsElement = document.querySelector('.cart-items');
            
            if (this.items.length === 0) {
                cartItemsElement.innerHTML = '<p>Корзина пуста</p>';
            } else {
                cartItemsElement.innerHTML = '';
                this.items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    
                    itemElement.innerHTML = `
                        <div>
                            <span>${item.name}</span>
                            <span class="item-total">${item.price * item.quantity} ₸</span>
                        </div>
                        <div class="quantity-controls">
                            <button class="quantity-btn decrement" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" 
                                   value="${item.quantity}" 
                                   min="1" 
                                   data-id="${item.id}">
                            <button class="quantity-btn increment" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}">×</button>
                        </div>
                    `;
                    
                    cartItemsElement.appendChild(itemElement);
                });
            }
            
            document.querySelector('.total-price').textContent = this.total;
            
            document.querySelectorAll('.decrement').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    this.decrementQuantity(productId);
                });
            });
            
            document.querySelectorAll('.increment').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    this.incrementQuantity(productId);
                });
            });
            
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const productId = e.target.dataset.id;
                    const newQuantity = parseInt(e.target.value);
                    if (!isNaN(newQuantity)) {
                        this.updateQuantity(productId, newQuantity);
                    }
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    this.removeItem(productId);
                });
            });
        }
    };

    // Обработчики добавления товаров
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productElement = e.target.closest('.product');
            const productId = productElement.getAttribute('data-id');
            const productName = productElement.querySelector('h3').textContent;
            const productPrice = parseFloat(productElement.querySelector('.price').textContent);
            
            cart.addItem(productId, productName, productPrice);
        });
    });
    
    // Обработчик очистки корзины
    document.querySelector('.clear-cart').addEventListener('click', () => {
        cart.clearCart();
    });

    // Обработчик отправки заказа
    document.querySelector('.send-order').addEventListener('click', () => {
        const alert = document.querySelector('.alert');
        const orderForm = document.querySelector('.order-form');
        const confirmBtn = document.querySelector('.confirm-order');
        const phoneInput = document.querySelector('.phone-input');
        
        if (cart.items.length === 0) {
            showAlert('Корзина пуста, добавьте товары перед оформлением!', 'error');
            return;
        }
        
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        const newConfirmBtn = document.querySelector('.confirm-order');
        
        orderForm.style.display = 'block';
        alert.style.display = 'none';
        phoneInput.classList.remove('invalid');
        phoneInput.value = '';
        
        newConfirmBtn.addEventListener('click', () => {
            const phone = phoneInput.value.trim();
            
            // Валидация телефона
            if (!validatePhone(phone)) {
                showAlert('Введите номер в формате +7XXXXXXXXXX', 'error');
                phoneInput.classList.add('invalid');
                return;
            }
            
            showAlert('Заказ отправлен! С вами свяжутся в ближайшее время.', 'success');
            orderForm.style.display = 'none';
            cart.clearCart();
        });
    });

    // Функция валидации телефона
    function validatePhone(phone) {
        const phoneRegex = /^\+7\d{10}$/;
        return phoneRegex.test(phone);
    }

    // Функция показа уведомлений
    function showAlert(message, type = 'success') {
        const alert = document.querySelector('.alert');
        alert.textContent = message;
        alert.className = `alert ${type}`;
        alert.style.display = 'block';
        
        setTimeout(() => {
            alert.style.display = 'none';
        }, 3000);
    }
});
