import { SignUp } from '@clerk/nextjs';
import { isClerkPubliclyConfigured } from '@/src/lib/clerk-config';

export default function SignUpPage() {
  if (!isClerkPubliclyConfigured()) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center space-y-3">
          <h1 className="text-xl font-bold">Clerk is not configured yet</h1>
          <p className="text-sm text-slate-400">Add your Clerk publishable and secret keys, then restart the app.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/" />
    </main>
  );
}
