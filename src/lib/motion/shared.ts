/**
 * `view-transition-name` for a project's screen composition. The same name sits on the source
 * (hero pill's active showcase, or a work row's showcase) and on the case-study top, so the
 * browser morphs one into the other. Only ONE element per page may carry a given name at a time.
 *
 * A name must be a valid CSS identifier, so anything outside [A-Za-z0-9-] is replaced by `_` and its
 * code point in hex (injective: two different slugs never share a name).
 */
export function showcaseName(slug: string): string {
	const safe = [...slug]
		.map((ch) => (/[A-Za-z0-9-]/.test(ch) ? ch : `_${ch.codePointAt(0)!.toString(16)}_`))
		.join('');
	return `project-${safe}`;
}
