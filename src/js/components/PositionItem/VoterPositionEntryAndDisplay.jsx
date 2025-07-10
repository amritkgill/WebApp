import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Button, InputBase, Radio, FormControlLabel, RadioGroup, Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Edit as EditIcon } from '@mui/icons-material';
import SupportActions from '../../actions/SupportActions';
import { prepareForCordovaKeyboard } from '../../common/utils/cordovaUtils';
import { isAndroid } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import ActivityStore from '../../stores/ActivityStore';
import AppObservableStore from '../../common/stores/AppObservableStore';
import PoliticianStore from '../../common/stores/PoliticianStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric } from '../../utils/applicationUtils';
import ModalDisplayTemplateB, {
  templateBStyles, TextFieldDiv,
  TextFieldForm, TextFieldWrapper, VoterAvatarImg,
  UserInfoWrapper, UserInfoText, UserName, PositionBlockWrapper, CommentContainer, InputBox,
} from '../Widgets/ModalDisplayTemplateB';
import ActivityPostPublicDropdown from '../Activity/ActivityPostPublicDropdown';
import VoterPositionEditNameAndPhotoModal from './VoterPositionEditNameAndPhotoModal';

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));

const VoterPositionEntryAndDisplay = (props) => {
  const { classes, externalUniqueId, politicianWeVoteId } = props;
  const { allCachedPoliticians } = PoliticianStore.getState();

  const [initialFocusSet, setInitialFocusSet] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [politicianName, setPoliticianName] = useState('');
  const [positionExists, setPositionExists] = useState(false);
  const [selectedStance, setSelectedStance] = useState('SUPPORT');
  const [showModal, setShowModal] = useState(false);
  const [statementText, setStatementText] = useState('');
  const [visibilityIsPublic, setVisibilityIsPublic] = useState(false);
  const [voterName, setVoterName] = useState('');
  const [voterPhotoUrlMedium, setVoterPhotoUrlMedium] = useState('');

  const handleEditModalOpen = () => {
    if (VoterStore.getVoterIsSignedIn()) {
      setIsEditModalOpen(true);
    } else {
      AppObservableStore.setShowSignInModal(true);
    }
  };
  const handleEditModalClose = () => {
    setIsEditModalOpen(false); // Close the modal
  };

  const toggleModalLocal = () => {
    setShowModal((prev) => !prev); // Toggle the modal
  };

  const openPositionModal = () => {
    if (VoterStore.getVoterIsSignedIn()) {
      toggleModalLocal();
    } else {
      AppObservableStore.setShowSignInModal(true);
    }
  };

  // useRef to reference the post input
  const activityPostInputRef = useRef(null);

  const onSupportStoreChange = () => {
    let voterPositionIsPublic = false;
    let voterTextStatement = '';
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet('', politicianWeVoteId);
    if (ballotItemStatSheet) {
      ({ voterPositionIsPublic, voterTextStatement } = ballotItemStatSheet);
      const { voterOpposesBallotItem, voterSupportsBallotItem } = ballotItemStatSheet;
      let stanceTemp = 'INFO_ONLY';
      if (voterSupportsBallotItem) {
        stanceTemp = 'SUPPORT';
      } else if (voterOpposesBallotItem) {
        stanceTemp = 'OPPOSE';
      }
      setSelectedStance(stanceTemp);
      setStatementText(voterTextStatement);
      setVisibilityIsPublic(voterPositionIsPublic);
    }
  };

  const onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    setVoterPhotoUrlMedium(voter.voter_photo_url_medium);
    setVoterName(voter.full_name || 'Anonymous');
  };

  const handleOpinionChange = (event) => {
    setSelectedStance(event.target.value);
  };

  useEffect(() => {
    if (politicianWeVoteId && allCachedPoliticians && allCachedPoliticians[politicianWeVoteId]) {
      const { politician_name: politicianNameNew } = allCachedPoliticians[politicianWeVoteId];
      setPoliticianName(politicianNameNew);
      // console.log('VoterPositionEntryAndDisplay useEffect politicianName: ', politicianNameNew);
    }
  }, [politicianWeVoteId, allCachedPoliticians]);

  useEffect(() => {
    if (activityPostInputRef.current && !initialFocusSet) {
      const input = activityPostInputRef.current;
      const { length } = input.value;
      input.focus();
      input.setSelectionRange(length, length);
      setInitialFocusSet(true);
    }
  }, [initialFocusSet]);

  useEffect(() => {
    const activityStoreListener = ActivityStore.addListener(onSupportStoreChange);
    const voterStoreListener = VoterStore.addListener(onVoterStoreChange);
    onSupportStoreChange();
    onVoterStoreChange();

    return () => {
      activityStoreListener.remove();
      voterStoreListener.remove();
    };
  }, []);

  const onFocusInput = () => {
    prepareForCordovaKeyboard('VoterPositionEntryAndDisplay');
  };

  const savePosition = (e) => {
    e.preventDefault();
    // TEMP
    const ballotItemWeVoteId = '';
    const visibilitySetting = visibilityIsPublic ? 'SHOW_PUBLIC' : 'FRIENDS_ONLY';
    const kindOfBallotItem = 'CANDIDATE';
    SupportActions.voterPositionCommentSave(ballotItemWeVoteId, kindOfBallotItem, politicianWeVoteId, statementText, selectedStance, visibilitySetting);
    toggleModalLocal();
  };

  const updateStatementTextToBeSaved = (e) => {
    setStatementText(e.target.value);
  };

  renderLog('VoterPositionEntryAndDisplay'); // Set LOG_RENDER_EVENTS to log all renders

  const dialogTitleText = politicianName ? `Create opinion about ${politicianName}`  : `Edit opinion about:  ${politicianName}`;
  const statementPlaceholderText = 'What\'s on your mind?';
  const rowsToShow = isAndroid() ? 4 : 6;

  const OpinionBlock = ({ onClick }) => (
    <PositionBlockWrapper>
      <UserInfoWrapper>
        <VoterAvatarImg
          alt=""
          src={voterPhotoUrlMedium || avatarGeneric()}
        />
        <EditIcon
          onClick={handleEditModalOpen}
          className={classes.styledEditIcon}
        />
      </UserInfoWrapper>
      <CommentContainerWrapper>
        <CommentContainer>
          {/* Open modal when input is clicked */}
          <InputBox
            type="text"
            placeholder="What's your opinion?"
            onClick={onClick}
            readOnly
          />
        </CommentContainer>
        <ItemActionBarContainer>
          <Suspense fallback={<></>}>
            <ItemActionBar
              ballotItemWeVoteId=""
              // ballotItemDisplayName={oneCandidate.ballot_item_display_name}
              commentButtonHide
              // commentButtonHide={!futureFeaturesDisabled && nextReleaseFeaturesEnabled}
              externalUniqueId={`VoterPositionEntryAndDisplay-ItemActionBar-${politicianWeVoteId}-${externalUniqueId}`}
              // hidePositionPublicToggle={!futureFeaturesDisabled && nextReleaseFeaturesEnabled}
              politicianWeVoteId={politicianWeVoteId}
              positionPublicToggleWrapAllowed
              shareButtonHide
              useHelpDefeatOrHelpWin
              useSupportWording
            />
          </Suspense>
        </ItemActionBarContainer>
      </CommentContainerWrapper>
    </PositionBlockWrapper>
  );
  OpinionBlock.propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  const defaultOpinionVisibilityText = (
    <p>
      Change your default visibility
      {' '}
      <a
        href="/settings/profile"
        className={classes.tooltipLink}
      >
        in your profile
      </a>
      .
    </p>
  );

  const textFieldJSX = (
    <TextFieldWrapper>
      <TextFieldForm
        className={classes.formStyles}
        // onBlur={onBlurInput}
        onFocus={onFocusInput}
        onSubmit={savePosition}
      >
        <UserInfoWrapper>
          <VoterAvatarImg
            alt=""
            src={voterPhotoUrlMedium || avatarGeneric()}
          />
          <EditIcon
            onClick={handleEditModalOpen}
            className={classes.styledEditIcon}
          />
          <UserInfoText>
            <UserName>
              {' '}
              {voterName}
              {/* Display the fetched name */}
            </UserName>
            <Tooltip
              arrow
              title={defaultOpinionVisibilityText}
              placement="top"
              classes={{ tooltip: classes.tooltipPaper, arrow: classes.tooltipArrow }}
            >
              <div>
                <ActivityPostPublicDropdown
                  visibilityIsPublic={visibilityIsPublic}
                  onVisibilityChange={(newVisibility) => setVisibilityIsPublic(newVisibility)}
                />
              </div>
            </Tooltip>
          </UserInfoText>
        </UserInfoWrapper>
        <RadioGroup
          row
          value={selectedStance}
          onChange={handleOpinionChange}
          className={classes.radioGroup}
        >
          <FormControlLabel
            value="SUPPORT"
            control={<Radio color="primary" />}
            label="Endorsing"
            classes={{ root: classes.radioLabel }}
          />
          <FormControlLabel
            value="OPPOSE"
            control={<Radio color="primary" />}
            label="Opposing"
            classes={{ root: classes.radioLabel }}
          />
          <FormControlLabel
            value="INFO_ONLY"
            control={<Radio color="primary" />}
            label="Info only"
            classes={{ root: classes.radioLabel }}
          />
        </RadioGroup>
        <TextFieldDiv>
          <InputBase
            classes={{ root: classes.inputStyles, inputMultiline: classes.inputMultiline }}
            id={`activityPostModalStatementText-${politicianWeVoteId}-${externalUniqueId}`}
            inputRef={activityPostInputRef}
            multiline
            name="statementText"
            onChange={updateStatementTextToBeSaved}
            placeholder={statementPlaceholderText}
            rows={rowsToShow}
            value={statementText || ''}
          />
        </TextFieldDiv>
        <Button
          id={`positionEntrySave-${politicianWeVoteId}-${externalUniqueId}`}
          variant="contained"
          color="primary"
          classes={{ root: classes.saveButtonRoot }}
          type="submit"
          // disabled={!statementText} // Commented out to allow saving without statement
          disabled={selectedStance === 'INFO_ONLY' && (!statementText || statementText.trim() === '')} // Disable if Neutral and no text
        >
          {positionExists ? 'Save Changes' : 'Add opinion' }
        </Button>
      </TextFieldForm>
    </TextFieldWrapper>
  );

  return (
    <>
      <ModalDisplayTemplateB
        dialogTitleJSX={<>{dialogTitleText}</>}
        show={showModal}
        textFieldJSX={textFieldJSX}
        toggleModal={toggleModalLocal}
      />
      {isEditModalOpen && (
        <VoterPositionEditNameAndPhotoModal
          show={isEditModalOpen}
          toggleModal={handleEditModalClose}
        />
      )}
      <OpinionBlock
        onClick={openPositionModal}
        politicianWeVoteId={politicianWeVoteId}
        voterPhotoUrlMedium={voterPhotoUrlMedium}
        voterName={voterName}
      />
    </>
  );
};
VoterPositionEntryAndDisplay.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
};

const CommentContainerWrapper = styled('div')`
  width: 100%;
`;

const ItemActionBarContainer = styled('div')`
  display: inline-block;
  margin-top: 6px;
`;

export default withStyles(templateBStyles)(VoterPositionEntryAndDisplay);
