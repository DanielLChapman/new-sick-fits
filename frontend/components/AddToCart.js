import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
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
  const [addToCart, { data, error, loading }] = useMutation(
    ADD_TO_CART_MUTATION,
    {
      variables: {
        id,
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  return (
    <button
      type="button"
      onClick={addToCart}
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
