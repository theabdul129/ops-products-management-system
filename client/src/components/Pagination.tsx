export function Pagination({
  page,
  totalPages,
  onPage
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
      <div className="muted">
        Page {page} of {Math.max(totalPages, 1)}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Prev
        </button>
        <button className="btn" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
