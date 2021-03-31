import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tels apollo we will take care of everything
    read(exisiting = [], { args, cache }) {
      const { skip, first } = args;

      // read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // check if we have exisiting items
      const items = exisiting.slice(skip, skip + first).filter((x) => x);
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we dont have any items, we must go to the network to fetch them
        return false;
      }

      if (items.length) {
        return items;
      }

      return false;
      // first thing it does is ask the read function for those items
      // we can eitehr do one of two things
      // first thing we can do is return the items because they are already in the cache
      // or
      // return false froom here (network requestion)
    },
    merge(exisiting, incoming, { args }) {
      const { skip, first } = args;
      // this runs when the apollo client comes back from the network with our product

      console.log('Merging items from the network');
      const merged = exisiting ? exisiting.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }

      return merged;
    },
  };
}
