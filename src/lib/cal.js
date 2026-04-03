/**
 * Cal.com integration utility
 * Buttons use data-cal-link + data-cal-config attributes.
 * The Cal.com embed script (loaded in app.html) handles
 * clicks automatically via MutationObserver.
 */

export const CAL_USERNAME = 'noelzappy';

export const CAL_EVENTS = {
	intro: '15min',                      // 15 min free intro
	architecture: 'architecture-review', // 90 min - $225
	fintech: 'african-fintech-strategy', // 60 min - $150
	codeReview: 'code-review',           // 60 min - $150
	general: 'general-consulting',       // 60 min - $150
	quick: 'quick-consulting'            // 30 min - $75
};
