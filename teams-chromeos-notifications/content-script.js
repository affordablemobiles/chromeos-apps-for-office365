try {
    setInterval(() => {
        try {
            let count = 0;

            // Target badges strictly in the primary navigation rail/app bar.
            // Falls back to any badge if nav rail structure changes.
            const badges = document.querySelectorAll(
                'nav [class*="fui-CounterBadge"], [role="navigation"] [class*="fui-CounterBadge"]'
            );

            const elementsToCount = badges.length > 0
                ? badges
                : document.querySelectorAll('[class*="fui-CounterBadge"]');

            elementsToCount.forEach((badge) => {
                // Only count visible badges
                if (badge.offsetParent === null) return;

                const cleaned = badge.innerText.replace(/\D/g, "");
                const parsed = parseInt(cleaned, 10);
                if (!Number.isNaN(parsed)) {
                    count += parsed;
                }
            });

            if (navigator.setAppBadge) {
                if (count > 0) {
                    navigator.setAppBadge(count);
                } else {
                    navigator.clearAppBadge();
                }
            }
        } catch (e) {
            console.error("Badge update error:", e);
        }
    }, 250);
} catch (s) {
    console.error("Interval initialization error:", s);
}
