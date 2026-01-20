"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KB = exports.DEALS = void 0;
exports.DEALS = [
    {
        id: "D-103",
        accountName: "Acme Robotics",
        stage: "Security Review",
        amountUsd: 78000,
        closeDate: "2026-02-15",
        owner: "David Assen",
        primaryContact: { name: "Priya Shah", email: "priya.shah@acmerobotics.example" },
        lastContactedAt: "2026-01-16",
        blockers: ["Waiting on customer security team timeline for review"],
        nextStep: "Ask for security review timeline and offer a 20-min call with our security POC to unblock.",
        notes: [
            "Customer requested SOC2 + security FAQ.",
            "They have a quarterly procurement checkpoint next week."
        ]
    },
    {
        id: "D-221",
        accountName: "Northwind Logistics",
        stage: "Negotiation",
        amountUsd: 120000,
        closeDate: "2026-03-01",
        owner: "Ana López",
        primaryContact: { name: "Mark Benson", email: "mark.benson@northwind.example" },
        lastContactedAt: "2026-01-10",
        blockers: ["Customer asking for a 25% discount (exception request)"],
        nextStep: "Evaluate discount request against pricing exception policy and seek approval if needed.",
        notes: [
            "Customer wants annual prepay discount + expedited onboarding.",
            "Concern: support SLA expectations."
        ]
    }
];
exports.KB = [
    {
        id: "kb-soc2",
        title: "SOC 2 Type II Report (Customer Access)",
        body: "We maintain an active SOC 2 Type II report. Customers can request access via the Trust Portal. " +
            "Share the Trust Portal link and advise the customer to sign the NDA flow before download.",
        url: "https://kb.example.com/compliance/soc2-type-ii",
        tags: ["security", "compliance", "soc2", "trust-portal"]
    },
    {
        id: "kb-pricing-exception",
        title: "Pricing Exception Policy",
        body: "Discount guidance: Standard discount up to 10% can be approved by Sales Manager. " +
            "10–20% requires VP Sales approval. Over 20% requires Finance + CRO approval and a written business case. " +
            "Any exception must document rationale, contract term, and impact on margin.",
        url: "https://kb.example.com/sales/pricing-exceptions",
        tags: ["sales", "pricing", "policy", "approval"]
    },
    {
        id: "kb-security-faq",
        title: "Security FAQ (Overview)",
        body: "Security review support: Provide SOC2, security FAQ, and DPA. Typical customer security review completes in 5–15 business days " +
            "depending on customer process. We can schedule a security Q&A call if timeline is unclear.",
        url: "https://kb.example.com/security/faq",
        tags: ["security", "faq", "dpa", "review"]
    },
    {
        id: "kb-dpa",
        title: "Data Processing Addendum (DPA)",
        body: "We offer a standard DPA for customers. Legal review is supported through the standard contract workflow. " +
            "For custom clauses, escalate to Legal and include customer redlines.",
        url: "https://kb.example.com/legal/dpa",
        tags: ["legal", "dpa", "privacy"]
    },
    {
        id: "kb-sso",
        title: "SSO / SAML Support",
        body: "SSO is supported via SAML 2.0 for Enterprise plans. Provide setup instructions and confirm the customer's IdP (Okta, Azure AD, etc.).",
        url: "https://kb.example.com/product/sso-saml",
        tags: ["product", "sso", "saml", "enterprise"]
    },
    {
        id: "kb-data-residency",
        title: "Data Residency",
        body: "Default hosting region is US. EU hosting is available for Enterprise customers upon request. " +
            "Confirm requirements early and coordinate with Solutions Engineering.",
        url: "https://kb.example.com/security/data-residency",
        tags: ["security", "data", "residency", "enterprise"]
    }
];
