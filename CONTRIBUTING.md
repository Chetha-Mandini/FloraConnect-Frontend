# Contributing to FloraConnect Frontend

Welcome to the FloraConnect Frontend repository! This guide establishes workflow standards, React 19 + Tailwind CSS conventions, and verification steps to ensure code consistency and high-quality UI/UX.

---

## 🛠️ 1. Getting Started & Local Setup

### Prerequisites
* **Node.js**: v22 LTS (verify with `node -v`)
* **npm**: v10+ (verify with `npm -v`)

### Installation & Run
1. Clone the repository and navigate into the folder:
   ```bash
   git clone https://github.com/TourGo-App/FloraConnect-Frontend.git
   cd FloraConnect-Frontend
   ```
2. Install exact dependencies:
   ```bash
   npm install
   ```
3. Setup local environment variables (if overriding backend URL):
   * Create `.env.local` if you need to point to a custom API port:
     ```env
     VITE_API_BASE_URL=http://localhost:3001/api
     ```
   * *Note: Never place private secrets or API keys in Vite environment variables.*
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## 🎨 2. Component & Styling Guidelines

* **UI Primitives:** When building new pages, prioritize reusable components located in `src/components/ui/` (`Button`, `Input`, `Card`, `Badge`, `Modal`).
* **Tailwind CSS v4:** Use the botanical color palette defined in `src/styles/global.css` (emerald, forest greens, neutral slate).
* **Accessibility (a11y):**
  * Interactive elements (`<button>`, `<a>`, `<input>`) must have visible focus rings (`focus-visible:ring-2`).
  * Always provide descriptive `alt` attributes on images.
  * Native or portal modals must support closing via the **Escape** key and backdrop click.
* **Responsive Design:** Every view must look polished on Mobile (375px+), Tablet (768px+), and Desktop (1024px+).

---

## 🌿 3. Git Branching & Workflow

### Choosing an Issue
1. Check the [Open GitHub Issues](https://github.com/TourGo-App/FloraConnect-Frontend/issues).
2. Request maintainer assignment or comment on the issue before beginning work.

### Branch Naming Conventions
Always branch from the latest `main`:
```bash
git checkout main
git pull origin main
git checkout -b <branch-type>/FE-<issue-number>-<short-description>
```

**Branch Prefixes:**
* `feat/` — New feature or page (e.g., `feat/FE-04-registration-page`)
* `ui/` — UI primitive or styling enhancement (e.g., `ui/FE-01-button-component`)
* `fix/` — Bug fix or layout defect (e.g., `fix/FE-12-filter-reset`)
* `test/` — Playwright E2E or component tests (e.g., `test/FE-18-playwright-suite`)
* `docs/` — Documentation or assets metadata (e.g., `docs/FE-credits-update`)

---

## ✍️ 4. Commit Message Standards

We follow [Conventional Commits](https://www.conventionalcommits.org/):
```text
<type>(<scope>): <short descriptive summary in imperative mood>
```

**Examples:**
* `feat(auth): implement registration form with zod validation`
* `ui(components): add primary and outline button variants`
* `fix(navbar): resolve mobile drawer overflow on small screens`
* `test(e2e): automate flower catalogue search user journey`

---

## 🧪 5. Pre-PR Quality Checks

Before pushing, verify that your code compiles cleanly and meets ESLint standards:

```bash
# 1. Run ESLint checks
npm run lint

# 2. Run TypeScript compilation and production Vite build
npm run build
```

---

## 🚀 6. Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push origin <your-branch-name>
   ```
2. Open a Pull Request targeting `main`.
3. Set the PR title following standard format:
   * `[FE-XX] Concise description of the change` (e.g., `[FE-04] User Registration Page`)
4. Complete the PR template:
   * Link the issue (`Closes #4` or `Fixes #4`).
   * **Attach visual evidence:** At least one desktop and one mobile viewport screenshot or screen recording.
5. Request a review from maintainers. Passing CI checks are required for merge.

