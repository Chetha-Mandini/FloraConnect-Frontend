import type { InputHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sprout } from "lucide-react";

export const controlClass =
  "block h-11! w-full min-w-0 rounded-lg border! border-solid! border-[#dce5da]! bg-white px-3! py-0! text-sm text-[#17251c] outline-none! outline-offset-0! focus-visible:outline-none! transition-colors focus:border-[#245c35]! focus:ring-2 focus:ring-[#245c35]/15 disabled:cursor-wait disabled:bg-[#f7f9f5]";
export const labelClass = "mb-1.5 block text-xs font-semibold text-[#334a3b]";
export const actionClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#245c35]! px-5 py-2.5 text-sm font-semibold text-white! transition-colors hover:bg-[#153d28]! disabled:cursor-wait disabled:opacity-100!";
export function AuthField({
  label,
  id,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  return (
    <div className="min-w-0">
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input {...props} id={id} className={`${controlClass} ${className}`} />
    </div>
  );
}
export default function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main id="main" className="min-h-svh w-full bg-white">
      <div className="grid min-h-svh w-full md:grid-cols-[0.95fr_1.05fr]">
        <aside
          className="relative hidden min-h-svh overflow-hidden bg-[#153d28] md:flex"
          aria-label="The FloraConnect community"
        >
          <img
            src="/images/national-flower-hero-1448.webp"
            alt="Blue-violet Nymphaea nouchali water lilies"
            width="1448"
            height="1086"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#102b1e]/45" />
          <div className="relative z-10 flex w-full flex-col justify-between p-8 text-white lg:p-12">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 text-white!"
            >
              <Sprout size={28} />
              <span className="text-xl font-semibold">FloraConnect</span>
            </Link>
            <div className="max-w-[370px]">
              <p className="mb-4! text-[11px] font-semibold tracking-[0.16em] text-[#d0e8c9]">
                ROOTED IN COMMUNITY
              </p>
              <h2 className="mb-4! text-[clamp(30px,3vw,42px)]! leading-tight! text-white">
                Where nature
                <br />
                brings us together.
              </h2>
              <p className="text-sm leading-relaxed text-white/90">
                Discover remarkable flowers, share your passion, and connect
                with Sri Lanka&apos;s growing botanical community.
              </p>
            </div>
          </div>
        </aside>
        <section
          className="flex min-h-svh min-w-0 flex-col px-5 py-4 sm:px-10 lg:px-16"
          aria-labelledby="auth-title"
        >
          <Link
            to="/"
            className="inline-flex min-h-8 w-fit items-center gap-2 text-xs text-[#647067]"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="mx-auto my-auto w-full max-w-[460px] py-4">
            <p className="mb-3! inline-flex items-center gap-2 text-xs font-semibold text-[#245c35]">
              <Sprout size={21} /> FLORACONNECT
            </p>
            <h1
              id="auth-title"
              className="mb-2! text-[34px] leading-tight text-[#153d28]"
            >
              {title}
            </h1>
            <p className="mb-5! text-sm leading-relaxed text-[#647067]">
              {description}
            </p>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
