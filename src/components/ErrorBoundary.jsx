import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback: Fallback, title = 'Something went wrong' } = this.props;

    if (hasError) {
      if (Fallback) {
        return <Fallback error={error} onReset={this.handleReset} />;
      }

      return (
        <div
          className="min-h-[40vh] flex flex-col items-center justify-center px-6 text-center"
          role="alert"
        >
          <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5 text-muted" aria-hidden />
          </div>
          <h2 className="text-sm font-semibold text-foreground font-sans mb-2">{title}</h2>
          <p className="text-xs text-muted font-sans max-w-sm mb-6 leading-relaxed">
            {import.meta.env.DEV && error?.message
              ? error.message
              : 'An unexpected error occurred. Try reloading this view.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold uppercase tracking-wider touch-manipulation"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden />
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}
