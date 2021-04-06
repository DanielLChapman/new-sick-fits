import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useCart } from '../lib/cartState';
import DisplayError from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID) {
    addToCart(productId: $id) {
      id
    }
  }
`;

function AddToCart({ id }) {
  const { cartOpen, openCart } = useCart();
  const [addToCart, { data, error, loading }] = useMutation(
    ADD_TO_CART_MUTATION,
    {
      variables: {
        id,
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  const addingToCart = () => {
    addToCart();
    setTimeout(() => {
      openCart();
    }, 500);
  };
  return (
    <button
      type="button"
      onClick={addingToCart}
      aria-busy={loading}
      disabled={loading}
    >
      Add{loading && 'ing'} To Cart
    </button>
  );
}

AddToCart.propTypes = {
  id: PropTypes.string,
};

export default AddToCart;
