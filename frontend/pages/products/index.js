import { useRouter } from 'next/router';
import Pagination from '../../components/Pagination';
import Products from '../../components/Products';

export default function IndexPage() {
  const router = useRouter();
  const page = parseInt(router.query.page, 10) || 1;
  return (
    <>
      <Pagination page={page} />
      <Products page={page} />;
      <Pagination page={page} />
    </>
  );
}
