import './globals.css';
import { UserProvider } from '@/lib/UserContext';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'PESUPool | Intelligent Carpooling & Shared Mobility Platform',
  description: 'DBMS Experiential Learning Level 3 Project - PES University',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b1322] text-slate-100 antialiased min-h-screen flex flex-col">
        <UserProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 bg-[#090f1a] py-6 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200">PESUPool Platform</span>
                <span>• PES University DBMS Level 3 Capstone</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span>RDBMS (MySQL 8.4)</span>
                <span>• NoSQL (MongoDB Telemetry)</span>
                <span>• ACID Transactions</span>
                <span>• Stored Procedures & Triggers</span>
              </div>
            </div>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
