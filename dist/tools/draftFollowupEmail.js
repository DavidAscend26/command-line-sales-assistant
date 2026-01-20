"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draftFollowupEmail = draftFollowupEmail;
const getDeal_1 = require("./getDeal");
function draftFollowupEmail(dealId, intent) {
    const deal = (0, getDeal_1.getDeal)(dealId);
    // Very small “template library”
    const contactName = deal.primaryContact.name;
    const to = deal.primaryContact.email;
    if (intent === "ask_security_review_timeline") {
        const subject = `Quick check-in on security review timeline — ${deal.accountName}`;
        const body = `Hi ${contactName},\n\n` +
            `Hope you're doing well. I wanted to check in on the security review for ${deal.accountName}.\n` +
            `Do you have an estimated timeline for completion, or any remaining items we can help unblock?\n\n` +
            `If helpful, we can do a short security Q&A this week.\n\n` +
            `Best,\n${deal.owner}\n`;
        return { subject, body, to };
    }
    if (intent === "next_steps") {
        const subject = `Next steps on ${deal.accountName} — ${deal.id}`;
        const body = `Hi ${contactName},\n\n` +
            `Following up on ${deal.id}. Here’s what I suggest as next steps:\n` +
            `- ${deal.nextStep}\n\n` +
            `Does that work on your side?\n\n` +
            `Best,\n${deal.owner}\n`;
        return { subject, body, to };
    }
    // Default fallback
    const subject = `Follow-up — ${deal.accountName} (${deal.id})`;
    const body = `Hi ${contactName},\n\n` +
        `Just following up on ${deal.id}. Let me know what timeline you’re working with and how we can help.\n\n` +
        `Best,\n${deal.owner}\n`;
    return { subject, body, to };
}
