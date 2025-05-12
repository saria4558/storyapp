import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page';
import HomePage from '../pages/home/home-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import NewPage from '../pages/new/new-page';
import NotFoundPage from '../not-found';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

export const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/new': () => checkAuthenticatedRoute(new NewPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
};
// Render route:
export async function renderRoute(path) {
  const app = document.getElementById('app');
  const route = routes[path];

  let pageInstance;

  try {
    if (route) {
      // Jika fungsi route asynchronous
      pageInstance = await route();
    } else {
      pageInstance = new NotFoundPage();
    }

    app.innerHTML = pageInstance.render();
  } catch (error) {
    console.error('Error rendering route:', error);
    app.innerHTML = '<h1>Terjadi kesalahan saat memuat halaman.</h1>';
  }
}
