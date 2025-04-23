export default function extractPoliticianDetailsFromUrl (url) {
  // Split the URL into parts using '/'
  const parts = url.split('/');

  // assume the second part of the path is the SEO-friendly string ("nancy-a-montgomery-politician-from-new-york")
  const seoFriendlyPart = parts[1];
  console.log('SEO Friendly Part:', seoFriendlyPart);

  if (!seoFriendlyPart) {
    return { state: null, name: null };  // If there's no seoFriendlyPart, return null for state and name
  }

  // Split the SEO-friendly part by dashes to get the name and state words
  const words = seoFriendlyPart.split('-');
  console.log('Words:', words);

  const fromIndex = words.lastIndexOf('from');   // Look for the last occurrence of "from", as it typically separates the name and state, reduce chances of pulling "from" in the name
  console.log('From last Index:', fromIndex);

  if (fromIndex === -1) {
    return { state: null, name: null }; // If 'from' is not found, return null for both
  }

  // Extract state and name based on the position of 'from'
  const state = words.slice(fromIndex + 1).join(' ');  // Combine words after 'from' for the state
  const name = words.slice(0, fromIndex).join(' ');   // Combine words before 'from' for the name
  const nameWithoutPolitician = name ? name.replace(/\bpolitician\b/i, '').trim() : null;


  return { state, name: nameWithoutPolitician };
}
