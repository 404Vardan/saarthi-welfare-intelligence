import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  const location = useLocation();

  // If explicit items are passed, render them
  if (items.length > 0) {
    return (
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--slate)', marginBottom: '1.25rem' }}>
        <Link to="/citizen/dashboard" style={{ display: 'flex', alignItems: 'center', color: 'var(--slate)', textDecoration: 'none' }}>
          <Home size={14} />
        </Link>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight size={12} color="var(--border)" />
            {item.path ? (
              <Link to={item.path} style={{ color: 'var(--slate)', textDecoration: 'none' }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: 'var(--ink-navy)', fontWeight: 600 }}>{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // Auto-generate from pathname
  const pathnames = location.pathname.split('/').filter(Boolean);
  if (pathnames.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--slate)', marginBottom: '1.25rem' }}>
      <Link to={`/${pathnames[0]}/dashboard`} style={{ display: 'flex', alignItems: 'center', color: 'var(--slate)', textDecoration: 'none' }}>
        <Home size={14} />
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formatted = value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return (
          <React.Fragment key={to}>
            <ChevronRight size={12} color="var(--border)" />
            {isLast ? (
              <span style={{ color: 'var(--ink-navy)', fontWeight: 600 }}>{formatted}</span>
            ) : (
              <Link to={to} style={{ color: 'var(--slate)', textDecoration: 'none' }}>
                {formatted}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
