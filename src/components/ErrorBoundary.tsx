import { Component, type ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6f6f5', padding: '1.25rem' }}>
          <div style={{ maxWidth: '28rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{
              margin: '0 auto',
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 style={{ marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#1a1a18' }}>
              Something went wrong
            </h1>
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', lineHeight: 1.6, color: '#5d5c54' }}>
              The page could not be loaded. Please try refreshing.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                marginTop: '1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '0.5rem',
                backgroundColor: '#234e28',
                color: '#ffffff',
                fontWeight: 600,
                padding: '0.75rem 1.25rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


export { ErrorBoundary }