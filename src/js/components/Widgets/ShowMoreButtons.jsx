import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import lookupPageNameAndPageTypeDict from '../../utils/lookupPageNameAndPageTypeDict';
import TagManager from 'react-gtm-module';
import VoterStore from '../../stores/VoterStore';

class ShowMoreButtons extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleShowMoreClick = this.handleShowMoreClick.bind(this);
    this.pushDataLayer = this.pushDataLayer.bind(this);
  }

  handleShowMoreClick = () => {
    const { showMoreId, showMoreButtonWasClicked, trackInGTM, showMoreButtonsLink } = this.props;
    const { location: { pathname: currentPathname } } = window; // Get path here
    //if (trackInGTM) {
      //console.log('click');
      const eventName = showMoreButtonWasClicked ? 'showLessButtonClick' : 'showMoreButtonClick';
      this.pushDataLayer(eventName, showMoreId, currentPathname); // Use currentPathname
    //} else {
      //console.log('Show More/Less clicked (not tracked):', showMoreId);
    //}
    showMoreButtonsLink();
  };

  pushDataLayer = (eventName, showMoreId, currentPathname) => { 
    const currentPage = lookupPageNameAndPageTypeDict(currentPathname); 
    const dataLayerObject = {
      event: eventName,
      element_id: showMoreId,
      pageDetails: {
        pageName: currentPage.pageName,
        pageType: currentPage.pageType,
        pathName: currentPathname, 
      },
      userDetails: {
        weVoteVoterId: VoterStore.getVoterWeVoteId(),
      },
    };
    //console.log(currentPathname);
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  };

  render() {
    renderLog('ShowMoreButtons');
    const { classes, showLessCustomText, showMoreButtonWasClicked, showMoreCustomText, showMoreId } = this.props;
    let showMoreText;

    if (showMoreButtonWasClicked) {
      showMoreText = showLessCustomText || 'show less';
    } else {
      showMoreText = showMoreCustomText || 'show more';
    }

    return (
      <ShowMoreButtonsStyled className="card-child" id={`toggleContentButton-${showMoreId}`} onClick={this.handleShowMoreClick}>
        <ShowMoreButtonsText id="showMoreLink">
          {showMoreText}
          {' '}
          {showMoreButtonWasClicked ? (
            <ArrowDropUp classes={{ root: classes.cardFooterIconRoot }} />
          ) : (
            <ArrowDropDown classes={{ root: classes.cardFooterIconRoot }} />
          )}
        </ShowMoreButtonsText>
      </ShowMoreButtonsStyled>
    );
  }
}

ShowMoreButtons.propTypes = {
  classes: PropTypes.object,
  showLessCustomText: PropTypes.string,
  showMoreId: PropTypes.string.isRequired,
  showMoreButtonsLink: PropTypes.func.isRequired,
  showMoreButtonWasClicked: PropTypes.bool,
  showMoreCustomText: PropTypes.string,
};

const styles = (theme) => ({
  cardFooterIconRoot: {
    fontSize: 30,
    marginBottom: '.2rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
    },
  },
});

const ShowMoreButtonsStyled = styled('button')(({ theme }) => (`
  border: 0 !important;
  color: #206DB3;
  cursor: pointer;
  display: block !important;
  background: #fff !important;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
  padding: 0 !important;
  text-align: center !important;
  user-select: none;
  width: fit-content;
  ${theme.breakpoints.up('md')} {
    font-size: 16px;
  }
  &:hover {
    background-color: rgba(46, 60, 93, 0.15) !important;
    transition-duration: .2s;
  }
  @media print{
    display: none;
  }
`));

const ShowMoreButtonsText = styled('div')`
  margin: 8px 0 0 8px !important;
  padding: 0 !important;
  text-align: center !important;
  &:hover {
    text-decoration: underline;
  }
`;

export default withTheme(withStyles(styles)(ShowMoreButtons));