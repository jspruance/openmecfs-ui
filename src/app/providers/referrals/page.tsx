import { provider } from "@/lib/providerContent";
import ReferralsClient from "./ReferralsClient";

export const metadata = {
  title: "Referrals — Open ME/CFS",
  description:
    "Ready-to-copy referral text for specialty ME/CFS clinics (Stanford by default).",
};

export default function ReferralsPage() {
  const r = provider.referrals ?? {};
  const footer =
    provider.footer ??
    "For health professionals. Informational only — not medical advice.";

  return <ReferralsClient r={r} footer={footer} />;
}
