// at its simplest, access control is either a yes or no value

import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
    return !!sessionStorage;
}
