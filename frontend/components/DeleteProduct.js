import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct));
}

function DeleteProduct({ id, children }) {
  const [deleteProduct, { data, error, loading }] = useMutation(
    DELETE_PRODUCT_MUTATION,
    {
      variables: { id },
      update,
    }
  );
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (confirm('Are you sure you want to delete this item?')) {
          // go ahead and delete it
          console.log('DELETING');
          deleteProduct().catch((err) => alert(err.message));
        }
      }}
    >
      {children}
    </button>
  );
}

DeleteProduct.propTypes = {
  id: PropTypes.string,
  children: PropTypes.any,
};

export default DeleteProduct;
