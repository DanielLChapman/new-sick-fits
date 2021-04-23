// at its simplest, access control is either a yes or no value

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
    return !!sessionStorage;
}

const generatedPermissions = Object.fromEntries(
    permissionsList.map((permission) => [
        permission,
        function ({ session }: ListAccessArgs) {
            return !!session?.data.role?.[permission];
        },
    ])
);


// Permissions check if someone meets a criteria - yes or no.
export const permissions = {
    ...generatedPermissions,
    isAwesome({ session }: ListAccessArgs): boolean {
        return session?.data.name.includes('wes');
    },
};
