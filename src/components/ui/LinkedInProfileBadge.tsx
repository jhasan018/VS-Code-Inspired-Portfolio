import Script from "next/script";

interface LinkedInProfileBadgeProps {
  className?: string;
  headingClassName?: string;
}

export default function LinkedInProfileBadge({
  className = "",
  headingClassName = "",
}: LinkedInProfileBadgeProps) {
  return (
    <section
      aria-labelledby="linkedin-profile-heading"
      className={className}
    >
      <h2 id="linkedin-profile-heading" className={headingClassName}>
        Connect with the author
      </h2>

      <div className="mt-6 flex min-h-[270px] justify-center sm:justify-start">
        <div
          className="badge-base LI-profile-badge"
          data-locale="en_US"
          data-size="medium"
          data-theme="dark"
          data-type="VERTICAL"
          data-vanity="jhasan14152"
          data-version="v1"
        >
          <a
            className="badge-base__link LI-simple-link"
            href="https://bd.linkedin.com/in/jhasan14152?trk=profile-badge"
          >
            Jahid Hasan
          </a>
        </div>
      </div>

      <Script
        src="https://platform.linkedin.com/badges/js/profile.js"
        strategy="lazyOnload"
      />
    </section>
  );
}
