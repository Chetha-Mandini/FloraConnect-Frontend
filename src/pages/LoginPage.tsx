import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <main id="main" className="login-page">
      <div className="login-card">
        <aside className="login-story" aria-label="The FloraConnect community">
          <img
            src="/images/national-flower-hero-768.webp"
            alt="Blue-violet Nymphaea nouchali water lilies in bloom"
            width="768"
            height="576"
          />
          <div className="login-story-copy">
            <span className="login-eyebrow">
              <Sprout size={18} /> ROOTED IN COMMUNITY
            </span>
            <h2>
              A place to connect.
              <br />A community to grow.
            </h2>
            <p>
              Discover beautiful blooms and connect with Sri Lanka&apos;s flower
              community.
            </p>
          </div>
        </aside>
        <section className="login-panel" aria-labelledby="login-title">
          <Link className="login-back" to="/">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="login-intro">
            <span className="login-mark" aria-hidden="true">
              <Sprout size={27} />
            </span>
            <p className="login-eyebrow">WELCOME TO FLORACONNECT</p>
            <h1 id="login-title">Login</h1>
            <p>Welcome back to FloraConnect.</p>
          </div>
          <div className="login-notice" id="login-availability">
            <ShieldCheck size={20} aria-hidden="true" />
            <p>
              Member sign-in is not available yet. Your account details cannot
              be entered or submitted.
            </p>
          </div>
          <form
            aria-label="Member login"
            aria-describedby="login-availability"
            onSubmit={(event) => event.preventDefault()}
          >
            <fieldset disabled className="login-fields">
              <legend className="sr-only">
                Account credentials — sign-in unavailable
              </legend>
              <label htmlFor="login-email">Email address</label>
              <div className="login-input">
                <Mail size={18} aria-hidden="true" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@example.com"
                />
              </div>
              <label htmlFor="login-password">Password</label>
              <div className="login-input">
                <LockKeyhole size={18} aria-hidden="true" />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>
              <button className="button primary login-submit" type="submit">
                Sign in <ArrowRight size={17} />
              </button>
            </fieldset>
          </form>
          <p className="login-register">
            New to FloraConnect?{" "}
            <Link to="/register">
              Explore membership <ArrowRight size={14} />
            </Link>
          </p>
          <div className="login-browse">
            <span>Keep exploring</span>
            <Link to="/flowers">
              Discover our flower catalogue <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
