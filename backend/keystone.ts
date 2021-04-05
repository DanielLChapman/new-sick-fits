/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/indent */
import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';
import { CartItem } from './schemas/CartItem';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';


const databaseURL =
    process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // how long should they stay signed in
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        // todo: add in initial roles
    },
    passwordResetLink: {
        async sendToken(args) {
            // send the email
            await sendPasswordResetEmail(args.token, args.identity);
        },
    },
});

export default withAuth(config({
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL],
            credentials: true,
        },
    },
    db: {
        adapter: 'mongoose',
        url: databaseURL,
        async onConnect(keystone) {
            console.log('Connected to the database!');
            if (process.argv.includes('--seed-data')) {
                await insertSeedData(keystone);
            }
        },
    },
    lists: createSchema({
        // schema items go in here
        User,
        Product,
        ProductImage,
        CartItem,
    }),
    extendGraphqlSchema,
    ui: {
        // show the UI only for the people who pass this test
        isAccessAllowed: ({ session }) => !!session?.data,
    },
    session: withItemData(statelessSessions(sessionConfig), {
        User: 'id'
    })

}));
