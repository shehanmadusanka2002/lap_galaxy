# Shopping Cart Implementation Guide

## Overview
Complete shopping cart system with backend API and frontend integration for LapGalaxy e-commerce application.

## Features Implemented

### Backend Features
✅ Cart and CartItem models with JPA relationships
✅ Cart persistence in database
✅ Support for both authenticated users and guest users (session-based)
✅ Add/Update/Remove items from cart
✅ Automatic stock validation
✅ Quantity management with stock checks
✅ Cart totals calculation (subtotal, shipping, grand total)
✅ Free shipping for orders over Rs. 50,000
✅ Merge guest cart with user cart after login
✅ RESTful API endpoints

### Frontend Features
✅ Full cart management UI
✅ Add to cart from product details page
✅ View cart with all items
✅ Update item quantities
✅ Remove items from cart
✅ Clear entire cart
✅ Real-time totals calculation
✅ Shipping cost display
✅ Stock availability checks
✅ Loading states and error handling
✅ Responsive design with dark mode support

## API Endpoints

### 1. Add Item to Cart
```
POST /api/cart/add
Body: {
  "productId": 1,
  "quantity": 2,
  "sessionId": "guest_abc123" // For guest users only
}
Headers: Authorization: Bearer <token> // For authenticated users
```

### 2. Get Cart
```
GET /api/cart?sessionId=guest_abc123
Headers: Authorization: Bearer <token> // For authenticated users
```

### 3. Update Item Quantity
```
PUT /api/cart/{cartId}/items/{itemId}?quantity=3
```

### 4. Remove Item
```
DELETE /api/cart/{cartId}/items/{itemId}
```

### 5. Clear Cart
```
DELETE /api/cart/{cartId}/clear
```

### 6. Merge Guest Cart (After Login)
```
POST /api/cart/merge?sessionId=guest_abc123
Headers: Authorization: Bearer <token>
```

## Database Schema

### carts table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY -> users)
- session_id (for guest users)
- total_amount
- total_items
- created_at
- updated_at

### cart_items table
- id (PRIMARY KEY)
- cart_id (FOREIGN KEY -> carts)
- product_id (FOREIGN KEY -> products)
- quantity
- unit_price
- subtotal

## How to Use

### Backend
1. The backend will automatically create the tables on first run
2. No additional configuration needed
3. Restart your Spring Boot application to load the new controllers

### Frontend

#### Add to Cart from Product Details:
```javascript
import { cartAPI } from '../services/cartService';

// Add item to cart
await cartAPI.addToCart(productId, quantity);
```

#### View Cart:
Navigate to `/cart` route

#### Cart Operations:
```javascript
// Get cart
const cart = await cartAPI.getCart();

// Update quantity
await cartAPI.updateCartItem(cartId, itemId, newQuantity);

// Remove item
await cartAPI.removeFromCart(cartId, itemId);

// Clear cart
await cartAPI.clearCart(cartId);
```

## User Flow

### For Guest Users:
1. Browse products
2. Add items to cart (stored with session ID)
3. View cart at `/cart`
4. Update quantities or remove items
5. On login, guest cart automatically merges with user cart

### For Authenticated Users:
1. Login
2. Cart is associated with user account
3. Cart persists across sessions
4. Same cart management features

## Features to Add Later (Optional)

1. **Wishlist Integration**: Move items from wishlist to cart
2. **Save for Later**: Move cart items to "save for later" list
3. **Cart Expiry**: Auto-clear guest carts after X days
4. **Coupon Codes**: Apply discount codes
5. **Cart Sharing**: Generate shareable cart link
6. **Recently Viewed**: Show recently viewed products
7. **Product Recommendations**: "You might also like" in cart
8. **Cart Notifications**: Notify when cart items go on sale

## Testing

### Test Scenarios:
1. ✅ Add product to cart
2. ✅ Update quantity (increase/decrease)
3. ✅ Remove item from cart
4. ✅ Clear entire cart
5. ✅ Stock validation (can't add more than available)
6. ✅ Free shipping threshold (Rs. 50,000)
7. ✅ Guest cart persistence
8. ✅ Merge cart on login

### Test Commands:
```bash
# Test add to cart (guest)
curl -X POST http://localhost:8080/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2, "sessionId": "guest_test123"}'

# Test get cart
curl http://localhost:8080/api/cart?sessionId=guest_test123

# Test update quantity
curl -X PUT "http://localhost:8080/api/cart/1/items/1?quantity=5"

# Test remove item
curl -X DELETE http://localhost:8080/api/cart/1/items/1
```

## Troubleshooting

### Cart not loading:
- Check if backend is running on port 8080
- Verify database connection
- Check browser console for errors

### Items not adding to cart:
- Verify product has sufficient stock
- Check if product ID is valid
- Look for error messages in response

### Guest cart not persisting:
- Check localStorage for 'guestSessionId'
- Verify sessionId is being sent in requests

## Next Steps

1. **Restart Backend**: Restart Spring Boot to load new cart tables
2. **Test API**: Use Postman or curl to test endpoints
3. **Test Frontend**: Try adding products to cart from UI
4. **Implement Checkout**: Create checkout flow (payment, order creation)
5. **Add Order History**: Store completed orders
6. **Email Notifications**: Send order confirmations

## Files Created/Modified

### Backend:
- ✅ Cart.java (model)
- ✅ CartItem.java (model)
- ✅ CartDTO.java
- ✅ CartItemDTO.java
- ✅ AddToCartRequest.java
- ✅ CartRepository.java
- ✅ CartItemRepository.java
- ✅ CartService.java
- ✅ CartController.java

### Frontend:
- ✅ cartService.js (new)
- ✅ Cart.jsx (updated)
- ✅ ProductDetails.jsx (updated)

## Support

For issues or questions:
1. Check console logs (both frontend and backend)
2. Verify API requests in Network tab
3. Check database tables for data
4. Review error messages

---

**Status**: ✅ Complete and ready to use!
**Version**: 1.0.0
**Last Updated**: November 14, 2025
