import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { deleteProduct, getOwners, listProducts } from '../api/products';
import type { ProductStatus } from '../types';
import { ProductFilters, type Filters } from '../components/ProductFilters';
import { ProductTable } from '../components/ProductTable';
import { Pagination } from '../components/Pagination';

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<Filters>({
    q: '',
    ownerId: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const ownersQuery = useQuery({
    queryKey: ['owners'],
    queryFn: getOwners
  });

  const listParams = useMemo(() => {
    const params: any = {
      page,
      pageSize: 10,
      q: filters.q || undefined,
      ownerId: filters.ownerId || undefined,
      status: (filters.status || undefined) as ProductStatus | undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    };
    return params;
  }, [filters, page]);

  const productsQuery = useQuery({
    queryKey: ['products', listParams],
    queryFn: () => listProducts(listParams),
    keepPreviousData: true
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const owners = ownersQuery.data ?? [];
  const data = productsQuery.data;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>Products</h1>
          <div className="muted">Create, view, update, and delete operational products.</div>
        </div>
        <Link to="/products/new" className="btn primary">
          + New Product
        </Link>
      </div>

      <ProductFilters
        owners={owners}
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />

      {productsQuery.isLoading ? (
        <div className="card">Loading...</div>
      ) : productsQuery.isError ? (
        <div className="card">Error: {(productsQuery.error as Error).message}</div>
      ) : (
        <>
          <ProductTable
            products={data?.items ?? []}
            onDelete={(id) => {
              if (confirm('Delete this product?')) {
                deleteMutation.mutate(id);
              }
            }}
          />

          <Pagination
            page={data?.meta.page ?? 1}
            totalPages={data?.meta.totalPages ?? 1}
            onPage={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
}
