import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div>
      <header className="topbar">
        <div className="container" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800 }}>Ops Products</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Products & Owners dashboard</div>
            </div>
            <nav style={{ display: 'flex', gap: 12 }}>
              <NavLink to="/products" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
                Products
              </NavLink>
              <NavLink to="/owners" className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
                Owners
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
