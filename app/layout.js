import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'School Project',
  description: 'Add and view schools built with Next.js and MySQL',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
