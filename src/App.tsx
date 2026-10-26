import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './pages/admin/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { CollectionPage } from './pages/CollectionPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { CartPage } from './pages/CartPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPage } from './pages/PolicyPage';
import { FAQPage } from './pages/FAQPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminCollectionsPage } from './pages/admin/AdminCollectionsPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminPoliciesPage } from './pages/admin/AdminPoliciesPage';

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Storefront Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/categories/:slug" element={<CategoryPage />} />
              <Route path="/collections/:slug" element={<CollectionPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/delivery" element={<PolicyPage />} />
              <Route path="/returns" element={<PolicyPage />} />
              <Route path="/product-disclaimer" element={<PolicyPage />} />
              <Route path="/privacy" element={<PolicyPage />} />
              <Route path="/terms" element={<PolicyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Console */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<AdminProductFormPage />} />
              <Route path="products/:id/edit" element={<AdminProductFormPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="collections" element={<AdminCollectionsPage />} />
              <Route path="content" element={<AdminContentPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="policies" element={<AdminPoliciesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </StoreProvider>
  );
}
