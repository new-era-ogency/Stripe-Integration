import Script from "next/script"

const IUBENDA_SITE_ID = 4592982
const IUBENDA_COOKIE_POLICY_ID = 73659570

export default function IubendaCookieConsent() {
  return (
    <>
      <Script id="iubenda-cs-config" strategy="beforeInteractive">
        {`
          var _iub = _iub || [];
          _iub.csConfiguration = {"siteId":${IUBENDA_SITE_ID},"cookiePolicyId":${IUBENDA_COOKIE_POLICY_ID},"lang":"en","storage":{"useSiteId":true}};
        `}
      </Script>
      <Script
        id="iubenda-autoblocking"
        src={`https://cs.iubenda.com/autoblocking/${IUBENDA_SITE_ID}.js`}
        strategy="beforeInteractive"
      />
      <Script
        id="iubenda-gpp-stub"
        src="https://cdn.iubenda.com/cs/gpp/stub.js"
        strategy="beforeInteractive"
      />
      <Script
        id="iubenda-cs"
        src="https://cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="beforeInteractive"
        async
        charSet="UTF-8"
      />
    </>
  )
}
