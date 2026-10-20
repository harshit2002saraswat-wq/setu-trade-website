import { Component, type ReactNode } from 'react';
import { CircleAlert as AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-charcoal-50 px-5 py-12">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-charcoal-900">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
              The page could not be loaded. Please try refreshing. If the problem
              persists, the issue may be temporary.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="btn-primary mt-6"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
