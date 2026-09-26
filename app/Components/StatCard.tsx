import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary';
  icon?: string;
}

const variantToBg: Record<string, string> = {
  primary:   '#0d6efd',
  success:   '#198754',
  danger:    '#dc3545',
  warning:   '#ffc107',
  info:      '#0dcaf0',
  secondary: '#6c757d',
};

export default function StatCard({
  title,
  value,
  subtitle,
  variant = 'primary',
  icon,
}: StatCardProps) {
  return (
    <div
      className="card h-100"
      style={{
        borderLeft: `4px solid ${variantToBg[variant]}`,
      }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6
              className="text-uppercase mb-2"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                color: 'var(--text-color)',
                opacity: 0.7,
              }}
            >
              {title}
            </h6>
            <div
              className="fw-bold"
              style={{ fontSize: '2rem', color: 'var(--text-color)' }}
            >
              {value}
            </div>
            {subtitle && (
              <small className="text-muted d-block mt-1">{subtitle}</small>
            )}
          </div>
          {icon && (
            <span style={{ fontSize: '1.8rem', opacity: 0.6 }}>{icon}</span>
          )}
        </div>
      </div>
    </div>
  );
}