import type { Metadata } from "next";
import Link from "next/link";
import { portfolio } from "@/data/portfolio";

const email = portfolio.contact.find((link) =>
  link.label.toLowerCase().includes("email"),
);

export const metadata: Metadata = {
  title: "Privacy Policy | Simon Kane",
  description: "Privacy policy for Simon Kane's portfolio.",
};

export default function PrivacyPage() {
  return (
    <main className="privacyPage">
      <article className="privacyDocument">
        <Link className="privacyBackLink" href="/">
          Back to portfolio
        </Link>
        <p className="privacyEyebrow">Privacy Policy</p>
        <h1>Privacy Policy</h1>
        <p className="privacyUpdated">Last updated: July 15, 2026</p>

        <section>
          <h2>Who is responsible</h2>
          <p>
            This portfolio is operated by Simon Kane. If you have questions
            about privacy or personal data, contact me at{" "}
            <a href={email?.href}>{email?.value}</a>.
          </p>
        </section>

        <section>
          <h2>What is collected</h2>
          <p>
            I use Vercel Analytics to understand general traffic patterns. This
            may include page views, referrers, approximate location, device
            type, operating system and browser information. Vercel Analytics is
            used for cookieless, aggregated statistics.
          </p>
          <p>
            If you accept analytics cookies, I also use Microsoft Clarity to
            understand how visitors interact with the site. This may include
            session recordings, clicks, scrolling, browser information and
            approximate technical details about your visit.
          </p>
        </section>

        <section>
          <h2>Why it is collected</h2>
          <p>
            The data is used to measure traffic, find problems and improve the
            portfolio. I do not use analytics data to identify individual
            visitors.
          </p>
        </section>

        <section>
          <h2>Cookies and consent</h2>
          <p>
            Microsoft Clarity is only loaded after you accept analytics in the
            consent banner. If you reject analytics, Microsoft Clarity is not
            loaded, Clarity cookies are not intentionally set, and session
            recording is disabled.
          </p>
          <p>
            Rejecting analytics does not disable Vercel Analytics. Vercel
            Analytics remains active because it is used without analytics
            cookies for aggregated traffic statistics. You can change your
            choice later by using the small analytics settings button on the
            site.
          </p>
        </section>

        <section>
          <h2>Third-party services</h2>
          <p>
            The site uses Vercel Analytics and Microsoft Clarity. Their own
            privacy information is available here:
          </p>
          <ul>
            <li>
              <a href="https://vercel.com/docs/analytics/privacy-policy">
                Vercel Analytics Privacy
              </a>
            </li>
            <li>
              <a href="https://privacy.microsoft.com/privacystatement">
                Microsoft Privacy Statement
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>Your rights</h2>
          <p>
            You can contact me if you have questions about how your data is
            handled, or if you want to exercise rights available under
            applicable privacy laws.
          </p>
        </section>
      </article>
    </main>
  );
}
