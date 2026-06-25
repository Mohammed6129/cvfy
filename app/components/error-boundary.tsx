"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";

type Props = { children: ReactNode; fallbackHref?: string; fallbackLabel?: string };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      const { fallbackHref = "/", fallbackLabel = "العودة للرئيسية" } = this.props;
      return (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <p className="mb-2 text-4xl">⚠️</p>
          <h2 className="mb-2 text-lg font-bold text-white">حدث خطأ غير متوقع</h2>
          <p className="mb-6 text-sm text-white/60">يرجى المحاولة مرة أخرى أو العودة للصفحة السابقة.</p>
          <Link href={fallbackHref} className="glass-btn-primary px-6 py-3 text-sm">
            {fallbackLabel}
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
