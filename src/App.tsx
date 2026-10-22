import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { SuppliersPage } from '@/pages/SuppliersPage';
import { RequestQuotePage } from '@/pages/RequestQuotePage';
import { BlogListPage } from '@/pages/BlogListPage';
import { BlogDetailPage } from '@/pages/BlogDetailPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminEnquiryDetailPage } from '@/pages/admin/AdminEnquiryDetailPage';
import { AdminBlogPage } from '@/pages/admin/AdminBlogPage';
import { AdminBlogEditPage } from '@/pages/admin/AdminBlogEditPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LocaleLayout } from '@/i18n/LocaleLayout';

/** Public routes, mounted once unprefixed (English) and once under /:lang. */
const publicRoutes = (
  <>
    <Route index element={<HomePage />} />
    <Route path="products" element={<ProductsPage />} />
    <Route path="products/:slug" element={<ProductDetailPage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="suppliers" element={<SuppliersPage />} />
    <Route path="request-quote" element={<RequestQuotePage />} />
    <Route path="blog" element={<BlogListPage />} />
    <Route path="blog/:slug" element={<BlogDetailPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/enquiries/:id" element={<AdminEnquiryDetailPage />} />
              <Route path="/admin/blog" element={<AdminBlogPage />} />
              <Route path="/admin/blog/:id" element={<AdminBlogEditPage />} />
              <Route element={<LocaleLayout notFound={<NotFoundPage />} />}>{publicRoutes}</Route>
              <Route path=":lang" element={<LocaleLayout notFound={<NotFoundPage />} />}>
                {publicRoutes}
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
