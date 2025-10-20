// Auto-collapse sections for long posts
document.addEventListener('DOMContentLoaded', function() {
  const postContent = document.querySelector('.post-content');
  if (!postContent) return;

  // Get all h2 headings (main sections)
  const headings = postContent.querySelectorAll('h2');

  // Don't apply accordion if post is short
  if (headings.length < 4) return;

  headings.forEach((heading, index) => {
    // Skip "The Problem" section - keep it always visible
    if (heading.textContent.trim() === 'The Problem') return;

    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'accordion-section';

    // Create details element
    const details = document.createElement('details');
    // Open first few sections by default
    if (index < 2) {
      details.setAttribute('open', '');
    }

    // Create summary with heading content
    const summary = document.createElement('summary');
    summary.innerHTML = heading.innerHTML;
    summary.className = 'accordion-heading';

    // Create content wrapper
    const content = document.createElement('div');
    content.className = 'accordion-content';

    // Move all content between this h2 and the next h2 (or end) into content wrapper
    let nextElement = heading.nextElementSibling;
    const elementsToMove = [];

    while (nextElement && nextElement.tagName !== 'H2') {
      elementsToMove.push(nextElement);
      nextElement = nextElement.nextElementSibling;
    }

    // Build the accordion structure
    elementsToMove.forEach(el => content.appendChild(el));
    details.appendChild(summary);
    details.appendChild(content);
    wrapper.appendChild(details);

    // Replace the heading with the accordion
    heading.parentNode.insertBefore(wrapper, heading);
    heading.remove();
  });
});
