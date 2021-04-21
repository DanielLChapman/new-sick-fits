/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { KeystoneContext, SessionStore } from '@keystone-next/types';
import stripeConfig from '../lib/stripe';

import {
    CartItemCreateInput,
    OrderCreateInput,
} from '../.keystone/schema-types';

interface Arguments {
    token: string;
}

const graphql = String.raw;

async function checkout(
    root: any,
    { token }: Arguments,
    context: KeystoneContext
): Promise<OrderCreateInput> {
    // make sure they are signed in
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = context.session.itemId;
    if (!userId) {
        throw new Error('Sorry! You must be signed in to create an order!');
    }

    // calculate total price for order
    const user = await context.lists.User.findOne({
        where: {
            id: userId,
        },
        resolveFields: graphql`
            id
            name
            email
            cart {
                id
                quantity
                product {
                    name
                    price
                    description
                    id
                    photo {
                        id
                        image {
                            id
                            publicUrlTransformed
                        }
                    }
                }
            }
        `,
    });

    console.dir(user, { depth: null });

    const cartItems = user.cart.filter((cartItem) => cartItem.product);
    const amount = cartItems.reduce(function (
        tally: number,
        cartItem: CartItemCreateInput
    ) {
        return tally + cartItem.quantity * cartItem.product.price;
    },
        0);
    console.log(amount);
    // create charge with stripe library
    const charge = await stripeConfig.paymentIntents
        .create({
            amount,
            currency: 'USD',
            confirm: true,
            payment_method: token,
        })
        .catch((err) => {
            console.log(err);
            throw new Error(err.message);
        });

    // convert cart items to order items

    // create the order and return it
}

export default checkout;
