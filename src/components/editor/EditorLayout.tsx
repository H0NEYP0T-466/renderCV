import { type ReactNode } from 'react';

interface EditorLayoutProps {
  children: ReactNode;
}

export function EditorLayout({ children }: EditorLayoutProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">{children}</div>
    </div>
  );
}
