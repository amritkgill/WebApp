import { isChallengeSEOFriendlyURL, isPoliticianSEOFriendlyURL } from '../common/utils/isSEOFriendlyURL';
import { isWeVoteMarketingSite } from '../common/utils/hrefUtils';


// If there is a static path for a page, enter it here. If the path includes dynamic elements,
//  you'll need to generate the pageName and pageType dynamically in calculatePageNameAndPageTypeDict below.
const pageNameAndTypeSimpleDict = {
  // All pageType 'settings'
  '/settings': {
    pageName: 'Settings',
    pageType: 'settings',
  },
  '/settings/profile': {
    pageName: 'Profile',
    pageType: 'settings',
  },
  '/settings/email': {
    pageName: 'Email',
    pageType: 'settings',
  },
  '/settings/notifications': {
    pageName: 'Notifications',
    pageType: 'settings',
  },
  '/settings/account': {
    pageName: 'Account',
    pageType: 'settings',
  },
  '/settings/yourdata': {
    pageName: 'Yourdata',
    pageType: 'settings',
  },
  '/challenges': {
    pageName: 'ChallengesHomeLoader',
    pageType: 'challenge',
  },
  '/': {
    pageName: 'Ready',
    pageType: 'homepage',
  },
  '/ready': {
    pageName: 'Ready',
    pageType: 'homepage',
  },
  '/donate': {
    pageName: !isWeVoteMarketingSite() || window.isCordovaGlobal ? 'Ready' : 'Donate',
    pageType: !isWeVoteMarketingSite() || window.isCordovaGlobal ? 'homepage' : 'donate',
  },
  '/more/faq': {
    pageName: 'FAQ',
    pageType: 'faq',
  },
  '/more/network/friends': {
    pageName: 'Friends',
    pageType: 'friends',
  },
};

function calculatePageNameAndPageTypeDict (path) {
  // console.log("gtmPageNameAndType, path:", path);
  let settingsPageName = 'notSet'; // Per our naming convention for pageName, this would normally be 'NotSet' but I think the value of having settingsPageName being identical to settingsPageType will save us grief in the future.
  let settingsPageType = 'notSet';
  if (isChallengeSEOFriendlyURL(path)) {
    // We need to add more complex logic here because there are many paths in /src/App.jsx that use "/+/" in the path
    settingsPageType = 'challenge';
    if (path.endsWith('join-challenge')) {
      settingsPageName = 'ChallengeInviteFriendsJoin';
    } else if (path.endsWith('customize-message')) {
      settingsPageName = 'ChallengeInviteCustomizeMessage';
    } else if (path.endsWith('invite-friends')) {
      settingsPageName = 'ChallengeInviteFriends';
    } else if (path.endsWith('edit')) {
      settingsPageName = 'ChallengeStartEditAll';
    } else {
      settingsPageName = 'ChallengeHomePage';
    }
  } else if (isPoliticianSEOFriendlyURL(path)) {
    // We need to add more complex logic here because there are many paths in /src/App.jsx that use "/-/" in the path
    settingsPageType = 'politician';
    settingsPageName = 'PoliticianDetailsPage';
  }
  return {
    pageName: settingsPageName,
    pageType: settingsPageType,
  };
}

export default function lookupPageNameAndPageTypeDict (path) {
  if (pageNameAndTypeSimpleDict[path]) {
    return pageNameAndTypeSimpleDict[path];
  } else if (path.includes('/ballot')) {
    return {
      pageName: 'Ballot',
      pageType: 'ballot',
    };
  } else if (path.includes('/about')) {
    return {
      pageName: 'About',
      pageType: 'about',
    };
  } else if (path.endsWith('/cs/')) {
    return {
      pageName: 'CampaignesHomeLoader',
      pageType: 'candidate',
    };
  } else if (path.endsWith('/privacy')) {
    return {
      pageName: 'Privacy',
      pageType: 'privacy',
    };
  } else if (path.endsWith('/terms')) {
    return {
      pageName: 'TermsOfService',
      pageType: 'termsOfService',
    };
  } else if (path.startsWith('/friends')) {
    return {
      pageName: 'Friends',
      pageType: 'friends',
    };
  } else if (path.startsWith('/news')) {
    return {
      pageName: 'News',
      pageType: 'news',
    };
  } else {
    return calculatePageNameAndPageTypeDict(path);
  }
}
