// app/layout.tsx
import './globals.css';
import { AuthProvider } from '@/context/AuthContext'; // <--- Make sure this import path is correct

export const metadata = {
  title: 'ServerlessFlow',
  description: 'Modern Function Workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap everything inside AuthProvider */}
        <AuthProvider>
           {children}
        </AuthProvider>
      </body>
    </html>
  );
}