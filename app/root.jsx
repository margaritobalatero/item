import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import stylesUrl from './styles/global.css';

export const links = () => [{ rel: 'stylesheet', href: stylesUrl }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: 20 }}>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}