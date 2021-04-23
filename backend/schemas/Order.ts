/* eslint-disable @typescript-eslint/indent */
import { list } from '@keystone-next/keystone/schema';
import {
    text,
    relationship,
    select,
    integer,
    virtual,
} from '@keystone-next/fields';
import formatMoney from '../lib/formatMoney';
import { isSignedIn, permissions, rules } from '../access';

export const Order = list({
    // access
    access: {
        create: isSignedIn,
        read: rules.canOrder,
        update: () => false,
        delete: () => false,

    },
    // ui
    fields: {
        total: integer(),
        items: relationship({ ref: 'OrderItem.order', many: true }),
        user: relationship({ ref: 'User.orders' }),
        charge: text(),
        label: virtual({
            graphQLReturnType: 'String',
            resolver(item) {
                return `Order Total: ${formatMoney(item.total)}`;
            },
        }),
    },
});
