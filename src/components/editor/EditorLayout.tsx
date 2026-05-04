import { type ReactNode } from 'react';
import './EditorLayout.css';

interface EditorLayoutProps {
  children: ReactNode;
}

export function EditorLayout({ children }: EditorLayoutProps) {
  return (
    <div className="editor-layout">
      <div className="editor-layout__inner">{children}</div>
    </div>
  );
}
