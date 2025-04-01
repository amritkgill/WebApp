import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { isLargerThanTablet, isTablet } from '../../common/utils/isMobileScreenSize';
import TagManager from 'react-gtm-module';
import lookupPageNameAndPageTypeDict from '../../utils/lookupPageNameAndPageTypeDict';

const HeaderLogoImage = ({ src }) => {
  function handleClick(e) {
    const { location: { pathname: currentPathname } } = window;
    // console.log(`****HeaderLogoImage clicked!, currentPathname: ${currentPathname}********`);

    const page = lookupPageNameAndPageTypeDict(currentPathname);
    const destinationPage = lookupPageNameAndPageTypeDict('/ready');
    TagManager.dataLayer({
      dataLayer: {
        event: 'click',
        pageDetails: {
          pageType: page.pageType,
          pageName: page.pageName,
          pathName: currentPathname,
        },
        destinationDetails: {
          destinationPageType: destinationPage.pageType,
          destinationPageName: destinationPage.pageName,
          destinationPathName: '/ready',
        },
      },
    });
  }

  return (<LogoImg id="HeaderLogoImage" alt="WeVote Logo" src={src} onClick={handleClick} />);
};

HeaderLogoImage.propTypes = {
  src: PropTypes.string,
};

/* was the following css applied for an img
.header-logo-img {
  max-width: 132px;
  max-height: 42px;
}
*/
const LogoImg = styled('img')`
  ${isWebApp() ? 'min-width: 141px;' : ''}
  ${isTablet() ? 'padding: 4px;' : ''}
  ${isLargerThanTablet() ? 'padding: 2px;' : ''}
`;

export default HeaderLogoImage;
