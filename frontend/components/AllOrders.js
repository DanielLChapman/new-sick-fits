import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import DisplayError from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import OrderItemStyles from './styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
      id
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
      charge
    }
  }
`;

export function countItemsInAnOrder(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function AllOrders() {
  const { data, error, loading } = useQuery(USER_ORDERS_QUERY);
  const allOrders = data?.allOrders;
  if (error) return <DisplayError error={error} />;
  if (loading) return <div>Loading....</div>;
  return (
    <div>
      <Head>
        <title>Sick Fits - Your Orders ({allOrders.length})</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>
      <OrderUl>
        {allOrders.map((order) => (
          <OrderItemStyles>
            <Link href={`/order/${order.id}`}>
              <a>
                <div className="order-meta">
                  <p>
                    {countItemsInAnOrder(order)} item
                    {countItemsInAnOrder(order) > 1 ? 's' : ''}
                  </p>
                  <p>
                    {order.items.length} Product
                    {order.items.length > 1 ? 's' : ''}
                  </p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map((item) => (
                    <img
                      key={item.id}
                      src={item.photo?.image?.publicUrlTransformed}
                      alt={item.name}
                    />
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUl>
    </div>
  );
}

export default AllOrders;
