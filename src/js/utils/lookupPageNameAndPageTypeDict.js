import { isChallengeSEOFriendlyURL, isPoliticianSEOFriendlyURL } from '../common/utils/isSEOFriendlyURL';

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
  '/challenges': {
    pageName: 'ChallengesHomeLoader',
    pageType: 'challenge',
  },
};

function calculatePageNameAndPageTypeDict (path) {
  // console.log("gtmPageNameAndType, path:", path);
  let settingsPageName = '';
  let settingsPageType = '';
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
  if (path in pageNameAndTypeSimpleDict) {
    return pageNameAndTypeSimpleDict[path];
  } else {
    return calculatePageNameAndPageTypeDict(path);
  }
}
