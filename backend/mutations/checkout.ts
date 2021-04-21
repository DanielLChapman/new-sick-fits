/* eslint-disable @typescript-eslint/indent */
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

    console.log(charge);
    // convert cart items to order items
    const orderItems = cartItems.map((cartItem) => {
        const orderItem = {
            name: cartItem.product.name,
            description: cartItem.product.description,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            photo: {
                connect: {
                    id: cartItem.product.photo.id,
                },
            },
        };
        return orderItem;
    });

    // create the order and return it
    const order = await context.lists.Order.createOne({
        data: {
            total: charge.amount,
            charge: charge.id,
            items: { create: orderItems },
            user: { connect: { id: userId } },
        },
    });

    // clean up any old cart items
    const cartItemIds = user.cart.map((cartItem) => cartItem.id);
    await context.lists.CartItem.deleteMany({ ids: cartItemIds });

    return order;
}

export default checkout;
