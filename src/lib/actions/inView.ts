interface InViewOptions {
	threshold?: number;
	once?: boolean;
}

export function inView(
	node: Element,
	{ threshold = 0.15, once = true }: InViewOptions = {}
) {
	let observer: IntersectionObserver;

	function observe() {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						node.classList.add('in-view');
						if (once) observer.unobserve(node);
					}
				});
			},
			{ threshold }
		);
		observer.observe(node);
	}

	observe();

	return {
		destroy() {
			observer?.disconnect();
		}
	};
}
