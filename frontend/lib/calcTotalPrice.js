export default function calcTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.product) return tally; // products can be deleated but still be in the cart
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
}
