import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;