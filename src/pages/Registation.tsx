import { apiEndpoints } from "../config/api";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Flower2,
  Sprout,
  UserRound,
} from "lucide-react";
import AuthLayout, {
  actionClass,
  AuthField,
  controlClass,
  labelClass,
} from "../components/auth/AuthLayout";
import { api } from "../services/api/auth";

const paths = [
  {
    id: "personal",
    title: "Personal account",
    text: "Browse flowers and join the community.",
    Icon: UserRound,
  },
  {
    id: "florist",
    title: "Florist",
    text: "Apply to manage your own flower shop.",
    Icon: Flower2,
  },
  {
    id: "grower",
    title: "Grower",
    text: "Apply to sell the flowers you cultivate.",
    Icon: Sprout,
  },
  {
    id: "organization",
    title: "Organization representative",
    text: "Apply on behalf of your institution or society.",
    Icon: Building2,
  },
] as const;
type RegistrationKind = (typeof paths)[number]["id"];
const categories = [
  ["GOVERNMENT_BOTANICAL_INSTITUTION", "Government botanical institution"],
  ["HORTICULTURAL_SOCIETY", "Horticultural society"],
  ["FLORICULTURE_ASSOCIATION", "Floriculture association"],
  ["PLANT_CONSERVATION_ORGANIZATION", "Plant conservation organization"],
  ["COMMUNITY_GARDENING_SOCIETY", "Community gardening society"],
  ["RESEARCH_EDUCATIONAL_INSTITUTION", "Research / educational institution"],
];
const positions = [
  ["PRESIDENT", "President / Chairperson"],
  ["SECRETARY", "Secretary"],
  ["TREASURER", "Treasurer"],
  ["BOTANICAL_OFFICER", "Botanical officer"],
  ["RESEARCH_OFFICER", "Research officer"],
  ["COORDINATOR", "Society coordinator"],
  ["GENERAL_MEMBER", "General member"],
];
export default function RegistrationPage() {
  const [params] = useSearchParams();
  const [type, setType] = useState<RegistrationKind>(
    params.get("application") === "grower" ? "grower" : "personal",
  );
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmation: "",
    businessName: "",
    contact: "",
    location: "",
    evidenceUrl: "",
    organizationType: categories[0][0],
    position: "GENERAL_MEMBER",
  });
  const set =
    (key: keyof typeof details) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setDetails((previous) => ({ ...previous, [key]: event.target.value }));
      setError("");
    };
  const organization = type === "organization";
  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await api<{ message: string }>(
        apiEndpoints.auth.register,
        {
          method: "POST",
          body: {
            name: details.name,
            email: details.email,
            password: details.password,
            registrationKind: type,
            ...(type !== "personal"
              ? {
                  application: {
                    name: details.businessName,
                    contact: details.contact,
                    location: details.location,
                    evidenceUrl: details.evidenceUrl,
                    ...(organization
                      ? {
                          organizationType: details.organizationType,
                          position: details.position,
                        }
                      : {}),
                  },
                }
              : {}),
          },
        },
      );
      setDetails((previous) => ({
        ...previous,
        password: "",
        confirmation: "",
      }));
      setResult(response.message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthLayout
      title="Register"
      description="Choose your FloraConnect account."
    >
      {result ? (
        <div>
          <p
            role="status"
            className="rounded-xl border border-[#dce5da] bg-[#f1f6ee] p-4 text-sm leading-relaxed text-[#245c35]"
          >
            {result}
          </p>
          <Link to="/login" className={`${actionClass} mt-5`}>
            Go to login <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <ol
            className="mb-5 flex items-center gap-2 text-[11px] text-[#647067]"
            aria-label="Registration progress"
          >
            {[
              "Account type",
              "Personal details",
              ...(type === "personal" ? [] : ["Application"]),
            ].map((label, i) => (
              <li
                key={label}
                aria-current={step === i ? "step" : undefined}
                className={step === i ? "font-semibold text-[#245c35]" : ""}
              >
                {i + 1}. {label}
                {i < (type === "personal" ? 1 : 2) ? " /" : ""}
              </li>
            ))}
          </ol>
          {step === 0 ? (
            <div>
              <div
                className="grid gap-2"
                role="group"
                aria-label="Account type"
              >
                {paths.map(({ id, title, text, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={id === type}
                    onClick={() => setType(id)}
                    className={`flex min-h-16 items-center gap-3 rounded-xl border! border-solid! px-3 py-2.5 text-left! transition-colors ${id === type ? "border-[#245c35]! bg-[#f1f6ee]" : "border-[#dce5da]! bg-white hover:bg-[#f7f9f5]"}`}
                  >
                    <Icon size={22} className="shrink-0 text-[#245c35]" />
                    <span>
                      <span className="block text-sm font-semibold text-[#17251c]">
                        {title}
                      </span>
                      <span className="block text-[11px] leading-relaxed text-[#647067]">
                        {text}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="my-2! text-[11px] leading-relaxed text-[#647067]">
                Staff roles cannot be requested here. Business and organization
                management requires verification and approval.
              </p>
              <button
                className={`${actionClass} w-full`}
                onClick={() => setStep(1)}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form
              className="space-y-3"
              aria-label="Registration"
              onSubmit={async (event) => {
                event.preventDefault();
                setError("");
                if (details.password !== details.confirmation) {
                  setError("Your passwords do not match.");
                  return;
                }
                if (step === 1 && type !== "personal") {
                  setStep(2);
                  return;
                }
                await submit();
              }}
            >
              <fieldset
                disabled={busy}
                className="m-0 min-w-0 space-y-3 border-0 p-0"
              >
                <legend className="sr-only">
                  {step === 1 ? "Personal details" : "Application details"}
                </legend>
                {step === 1 ? (
                  <>
                    <AuthField
                      id="register-name"
                      label="Full name"
                      autoComplete="name"
                      required
                      maxLength={100}
                      value={details.name}
                      onChange={set("name")}
                    />
                    <AuthField
                      id="register-email"
                      label="Email address"
                      type="email"
                      autoComplete="email"
                      required
                      value={details.email}
                      onChange={set("email")}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <AuthField
                        id="register-password"
                        label="Password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        maxLength={128}
                        value={details.password}
                        onChange={set("password")}
                      />
                      <AuthField
                        id="register-confirm"
                        label="Confirm password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        maxLength={128}
                        value={details.confirmation}
                        onChange={set("confirmation")}
                      />
                    </div>
                    <p className="text-[11px] text-[#647067]">
                      Use 8–128 characters. Email verification is required to
                      activate your account.
                    </p>
                  </>
                ) : (
                  <>
                    <AuthField
                      id="application-name"
                      label={
                        organization ? "Organization name" : "Business name"
                      }
                      value={details.businessName}
                      onChange={set("businessName")}
                      maxLength={150}
                      required
                    />
                    {organization && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="organization-category"
                            className={labelClass}
                          >
                            Organization category
                          </label>
                          <select
                            id="organization-category"
                            className={controlClass}
                            value={details.organizationType}
                            onChange={set("organizationType")}
                          >
                            {categories.map(([id, label]) => (
                              <option key={id} value={id}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="organization-position"
                            className={labelClass}
                          >
                            Your position
                          </label>
                          <select
                            id="organization-position"
                            className={controlClass}
                            value={details.position}
                            onChange={set("position")}
                          >
                            {positions.map(([id, label]) => (
                              <option key={id} value={id}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <AuthField
                        id="application-contact"
                        label="Contact details"
                        value={details.contact}
                        onChange={set("contact")}
                        maxLength={200}
                        required
                      />
                      <AuthField
                        id="application-location"
                        label="Location"
                        value={details.location}
                        onChange={set("location")}
                        maxLength={200}
                        required
                      />
                    </div>
                    <AuthField
                      id="application-evidence"
                      label="Supporting evidence (HTTPS link)"
                      type="url"
                      pattern="https://.*"
                      placeholder="https://…"
                      value={details.evidenceUrl}
                      onChange={set("evidenceUrl")}
                      maxLength={1000}
                      required
                    />
                    <p className="text-[11px] leading-relaxed text-[#647067]">
                      Your position describes your organization role; it does
                      not grant software permissions. Evidence is reviewed by
                      platform staff.
                    </p>
                  </>
                )}
                {error && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-xs text-red-800"
                  >
                    {error}
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(step - 1);
                      setError("");
                    }}
                    className="inline-flex min-h-11 items-center gap-1 rounded-lg border! border-[#dce5da]! px-3 text-xs"
                  >
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    type="submit"
                    className={`${actionClass} flex-1`}
                    aria-busy={busy}
                  >
                    {busy
                      ? "Submitting…"
                      : step === 1 && type !== "personal"
                        ? "Continue"
                        : type === "personal"
                          ? "Create account"
                          : "Submit application"}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </fieldset>
            </form>
          )}
          <p className="mt-4! text-center text-xs text-[#647067]">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#245c35]! hover:underline"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
