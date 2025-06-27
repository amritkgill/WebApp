// lookupPageNameAndPageTypeDictForExternalUrls.js

// If there is a static path for a page, enter it here. If the path includes dynamic elements,
//  you'll need to generate the pageName and pageType dynamically in calculatePageNameAndPageTypeDict below.
// TODO Update to with hard-coded External URLs we use
import { isPoliticianSEOFriendlyURL } from '../common/utils/isSEOFriendlyURL';
import lookupPageNameAndPageTypeDict from './lookupPageNameAndPageTypeDict';

const pageNameAndTypeSimpleDictForExternalUrls = {
  'https://google.com': {
    pageName: 'GoogleSearch',
    pageType: 'search',
  },
  'https://help.wevote.us/hc/en-us': {
    pageName: 'WeVoteSupport',
    pageType: 'support',
  },
  'https://wevote.applytojob.com/apply': {
    pageName: 'WeVoteVolunteer',
    pageType: 'career',
  },
};

/**
 * Takes a path to a page, or a full URL, but not a URL to wevote like https://wevote.us/ballot
 * TODO Update to recognize social sites, and other regular places we send people
 * @param pathOrURL
 * @returns {{pageName: string, pageType: string}}
 */
function calculatePageNameAndPageTypeDict (pathOrURL) {
  // console.log("gtmPageNameAndType, path:", path);
  let pageName = 'notSet'; // Per our naming convention for pageName, this would normally be 'NotSet' but I think the value of having pageName being identical to pageType will save us grief in the future.
  let pageType = 'notSet';

  if (pathOrURL.includes('/-/')) {
    pageName = 'OpinionSource';
    pageType = 'reference';
  } else if (pathOrURL.startsWith('/ballot')) {
    pageName = 'Ballot';
    pageType = 'ballot';
  } else if (pathOrURL.startsWith('/candidate/')) {
    pageName = 'Candidate';
    pageType = 'candidate';
  } else if (pathOrURL.startsWith('/measure/')) {
    pageName = 'Measure';
    pageType = 'measure';
  } else if (pathOrURL.startsWith('/voterguide/')) {
    pageName = 'OrganizationVoterGuide';
    pageType = 'organizationVoterGuide';
  } else if (pathOrURL.endsWith('/cs/')) {
    pageName = 'CampaignsHomeLoader';
    pageType = 'candidate';
  } else if (isChallengeSEOFriendlyURL(pathOrURL)) {
    // We need to add more complex logic here because there are many paths in /src/App.jsx that use "/+/" in the path
    if (pathOrURL.endsWith('join-challenge')) {
      pageName = 'ChallengeInviteFriendsJoin';
    } else if (pathOrURL.endsWith('customize-message')) {
      pageName = 'ChallengeInviteCustomizeMessage';
    } else if (pathOrURL.endsWith('invite-friends')) {
      pageName = 'ChallengeInviteFriends';
    } else if (pathOrURL.endsWith('edit')) {
      pageName = 'ChallengeStartEditAll';
    } else {
      pageName = 'ChallengeHomePage';
    }
    pageType = 'challenge';
  } else if (pathOrURL.startsWith('/friends')) {
    pageName = 'Friends';
    pageType = 'friends';
  } else if (pathOrURL.startsWith('/news')) {
    pageName = 'News';
    pageType = 'news';
  } else if (pathOrURL.startsWith('/value/')) {
    pageName = 'IssuePage';
    pageType = 'issue';
  } else if (isPoliticianSEOFriendlyURL(pathOrURL)) {
    // We need to add more complex logic here because there are many paths in /src/App.jsx that use "/-/" in the path
    pageName = 'PoliticianDetailsPage';
    pageType = 'politician';
  } else if (/^\/[^/\s]+$/.test(pathOrURL)) {
    pageName = 'TwitterHandleLanding';
    pageType = 'endorser';  // Changed from 'twitterHandleLanding' to 'endorser'
  }

  if (pathOrURL.startsWith('https//' || 'http://')) {
    if (pathOrURL.startsWith('https://instagram.com')) {
      pageName = 'InstagramProfile';
      pageType = 'socialMedia';
    } else if (pathOrURL.startsWith('https://x.com') || pathOrURL.startsWith('https://twitter.com')) { // Includes old Twitter domains
      pageName = 'XTwitterProfile'; // Corrected name for X/Twitter
      pageType = 'socialMedia';
    } else if (pathOrURL.startsWith('https://www.youtube.com')) {
      pageName = 'YouTubeChannel';
      pageType = 'videoPlatform';
    } else if (pathOrURL.startsWith('https://www.wikipedia.org')) {
      pageName = 'WikipediaPage';
      pageType = 'encyclopedia';
    } else if (pathOrURL.startsWith('https://www.bing.com/search')) {
      pageName = 'BingSearchResults';
      pageType = 'searchEngine';
    } else if (pathOrURL.startsWith('https://www.google.com/search')) {
      pageName = 'GoogleSearchResults';
      pageType = 'searchEngine';
    }
  }

  return {
    pageName,
    pageType,
  };
}

export default function lookupPageNameAndPageTypeDictForExternalUrls (path) {
  if (pageNameAndTypeSimpleDictForExternalUrls[path]) {
    return pageNameAndTypeSimpleDictForExternalUrls[path];
  } else {
    return calculatePageNameAndPageTypeDictForExternalUrls(path);
  }
}
