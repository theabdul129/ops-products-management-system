import { useQueries, useQuery } from '@tanstack/react-query';
import { getOwners, listProducts } from '../api/products';

export function OwnersPage() {
  const ownersQuery = useQuery({ queryKey: ['owners'], queryFn: getOwners });
  const owners = ownersQuery.data ?? [];

  const counts = useQueries({
    queries: owners.map((o) => ({
      queryKey: ['productsCount', o.id],
      queryFn: async () => {
        const result = await listProducts({ ownerId: o.id, page: 1, pageSize: 1 });
        return result.meta.total;
      },
      enabled: owners.length > 0
    }))
  });

  if (ownersQuery.isLoading) return <div className="card">Loading...</div>;
  if (ownersQuery.isError) return <div className="card">Error: {(ownersQuery.error as Error).message}</div>;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Product Owners</h1>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th style={{ width: 160 }}>Products</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((o, idx) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>{o.name}</td>
                <td className="muted">{o.email ?? '—'}</td>
                <td>{counts[idx]?.data ?? '...'}</td>
              </tr>
            ))}
            {owners.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 20, textAlign: 'center', opacity: 0.7 }}>
                  No owners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
