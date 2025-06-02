import { isPoliticianSEOFriendlyURL } from '../common/utils/isSEOFriendlyURL';

// If there is a static path for a page, enter it here. If the path includes dynamic elements,
//  you'll need to generate the pageName and pageType dynamically in calculatePageNameAndPageTypeDict below.
// TODO Update to with hard-coded External URLs we use
const pageNameAndTypeSimpleDict = {
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

// TODO Update to recognize social sites, and other places we send people
function calculatePageNameAndPageTypeDict (path) {
  // console.log("gtmPageNameAndType, path:", path);
  let pageName = 'notSet'; // Per our naming convention for pageName, this would normally be 'NotSet' but I think the value of having pageName being identical to settingsPageType will save us grief in the future.
  let pageType = 'notSet';

  if (path.includes('/more/about')) {
    pageName = 'WeVoteTeam';
    pageType = 'about';
  } else if (path.includes('/more/credits')) {
    pageName = 'WeVoteCredits';
    pageType = 'about';
  } else if (path.startsWith('/ballot')) {
    pageName = 'Ballot';
    pageType = 'ballot';
  } else if (path.endsWith('/cs/')) {
    pageName = 'CampaignsHomeLoader';
    pageType = 'candidate';
  } else if (isPoliticianSEOFriendlyURL(path)) {
    pageType = 'politician';
    pageName = 'PoliticianDetailsPage';
  } else if (/^\/[^/\s]+$/.test(path)) {
    pageName = 'TwitterHandleLanding';
    pageType = 'twitterHandleLanding';
  }
  return {
    pageName,
    pageType,
  };
}

export default function lookupPageNameAndPageTypeDict (path) {
  if (pageNameAndTypeSimpleDict[path]) {
    return pageNameAndTypeSimpleDict[path];
  } else {
    return calculatePageNameAndPageTypeDict(path);
  }
}
