import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
      style={{
        background: `
          repeating-conic-gradient(from 30deg, transparent 0 120deg, #3c3c3c 0 180deg)
          calc(200px / 2) calc(200px * tan(30deg) / 2),
          repeating-conic-gradient(from 30deg, #1d1d1d 0 60deg, #4e4f51 0 120deg, #3c3c3c 0 180deg)
        `,
        backgroundSize: '200px calc(200px * tan(30deg))'
      }}
    >
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
