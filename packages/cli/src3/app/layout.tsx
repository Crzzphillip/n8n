import '../styles/n8n-theme.scss';
import { ModalProvider } from '../components/ui/ModalManager';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}