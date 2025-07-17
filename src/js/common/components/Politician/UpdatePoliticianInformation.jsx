import PropTypes from 'prop-types';
import React, { useState, Suspense } from 'react';
import styled from 'styled-components';
import { Close, EditOutlined, ExpandMoreRounded } from '@mui/icons-material';
import { Button, Dialog, IconButton } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled as muiStyled } from '@mui/material/styles';
import DesignTokenColors from '../Style/DesignTokenColors';
import standardBoxShadow from '../Style/standardBoxShadow';
import { StepTitle } from '../../../components/Style/ReadyIntroductionStyles';


const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../Widgets/OpenExternalWebSite'));

const updateCandidateInformationLink = 'https://docs.google.com/forms/d/e/1FAIpQLSePdeW32PClaSO1pUWBJnQ75wFGPOtviNaqOABBYps7NIH3hA/viewform?usp=sf_link';
const CustomTooltip = muiStyled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#001F3F',
    color: '#fff',
    fontSize: '13px',
    padding: '10px 10px 16px 16px',
    position: 'relative',
    width: '180px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#001F3F',
  },
}));

const UpdatePoliticianInformation =  (props) => {
  const [showVerifyWithEmailModal, setShowVerifyWithEmailModal] = useState(false);
  const [showVerifyOtherWaysModal, setShowVerifyOtherWaysModal] = useState(false);
  const [emailOption, setEmailOption] = useState('');
  const [passkey, setPasskey] = useState('');
  const { politicianName } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const newDesign2025 = false;
  const voterCanEditCandidate = true; // This should be determined by the actual application logic
  const voterCanEditCandidateHighlight = false;
  const publicEmails = ['info@adamshiff.com', 'john.dough@lacounty.gov'];
  const candidate = 'Adam Schiff';

  const handleOpenVerifyWithEmailModal = () => {
    setShowVerifyWithEmailModal(true);
  };

  const handleCloseVerifyWithEmailModal = () => {
    setShowVerifyWithEmailModal(false);
  };

  const handleEmailOptionClick = (e) => {
    if (emailOption !== e.target.value) {
      setEmailOption(e.target.value);
    } else {
      setEmailOption('');
    }
  };

  const handlePasskeyChange = (e) => {
    setPasskey(e.target.value);
  };

  const handleOpenVerifyOtherWaysModal = () => {
    setShowVerifyWithEmailModal(false);
    setShowVerifyOtherWaysModal(true);
  };

  const handleCloseVerifyOtherWaysModal = () => {
    setShowVerifyOtherWaysModal(false);
  };

  const verifyWithEmailModalOpen = () => (
    <VerifyModal
      open={showVerifyWithEmailModal}
      onClose={handleCloseVerifyWithEmailModal}
    >
      <VerifyModalWrapper>
        <VerifyModalHeaderContainer>
          <VerifyHeaderText>To edit this profile, verify as a candidate</VerifyHeaderText>
          <VerifyModalCloseButton onClick={handleCloseVerifyWithEmailModal}><Close /></VerifyModalCloseButton>
        </VerifyModalHeaderContainer>
        {publicEmails.length > 0 && (
          <FlexColumnContainer>
            <SelectPublicEmailsText>
              We found publicly available emails associated with
              {' '}
              {candidate}
              .
            </SelectPublicEmailsText>
            <SelectPublicEmailsText>
              Select the one you have access, enter your passkey or
              {' '}
              <OtherWaysToVerifyButton
                onClick={handleOpenVerifyOtherWaysModal}
              >
                see other ways to verify
              </OtherWaysToVerifyButton>
              .
            </SelectPublicEmailsText>
            <SelectPublicEmailsOptionsContainer>
              <SectionTitle>Verify with email</SectionTitle>
              {publicEmails.map((email) => (
                <EmailOptionContainer
                  key={email}
                >
                  <EmailOptionText
                    htmlFor={`public-email-option-${email}`}
                  >
                    <EmailOptionCheckbox
                      id={`public-email-option-${email}`}
                      type="checkbox"
                      checked={emailOption === email}
                      onChange={(e) => handleEmailOptionClick(e)}
                      value={email}
                    />
                    {email}
                  </EmailOptionText>
                </EmailOptionContainer>
              ))}
              <SelectPublicEmailsVerificationButton
                disabled={emailOption === ''}
              >
                Send verification code
              </SelectPublicEmailsVerificationButton>
              <SectionDivider />
            </SelectPublicEmailsOptionsContainer>
          </FlexColumnContainer>
        )}
        <FlexColumnContainer>
          <SectionTitle>Verify with passkey received through candidate contact form or social media</SectionTitle>
          <PasskeyVerificationInput
            type="text"
            placeholder="Passkey"
            value={passkey}
            onChange={handlePasskeyChange}
          />
          <SectionDivider />
          <OtherWaysToVerifyContainer>
            <OtherWaysToVerifyButtonLarge
              onClick={handleOpenVerifyOtherWaysModal}
            >
              See other ways to verify
            </OtherWaysToVerifyButtonLarge>
          </OtherWaysToVerifyContainer>
        </FlexColumnContainer>
      </VerifyModalWrapper>
    </VerifyModal>
  );

  const verifyOtherWaysModalOpen = () => {
    const relationshipOptions = ["I'm the candidate", 'Staff member', 'Volunteer', 'Other'];
    return (
      <VerifyModal
        open={showVerifyOtherWaysModal}
        onClose={handleCloseVerifyOtherWaysModal}
      >
        <VerifyModalWrapper>
          <VerifyModalHeaderContainerSmall>
            <VerifyHeaderText>
              Verify that you are authorized to edit
              {' '}
              {candidate}
              {' '}
              &apos;s profile
            </VerifyHeaderText>
            <VerifyModalCloseButton
              onClick={handleCloseVerifyOtherWaysModal}
            >
              <Close />
            </VerifyModalCloseButton>
          </VerifyModalHeaderContainerSmall>
          <VerifyModalSectionWrapper>
            <VerifyStepNumber>
              1
            </VerifyStepNumber>
            <StepTitle>
              What&apos;s your relationship to the candidate?
            </StepTitle>
          </VerifyModalSectionWrapper>
          <RelationshipOptionsContainer>
            {relationshipOptions.map((option) => (
              <label>
                <input
                  key={option}
                  type="radio"
                  value={option}
                />
                {option}
              </label>
            ))}
          </RelationshipOptionsContainer>
        </VerifyModalWrapper>
      </VerifyModal>
    );
  };

  return (
    <UpdateInformationWrapper>
      {!!(politicianName) && (
        <>
          {newDesign2025 ? (
            <>
              {voterCanEditCandidate ? (
                <CustomTooltip
                  interactive
                  arrow
                  placement="right"
                  open={tooltipOpen}
                  onOpen={() => setTooltipOpen(true)}
                  onClose={() => setTooltipOpen(false)}
                  title={(
                    <TooltipContent>
                      <CloseButton size="small" onClick={() => setTooltipOpen(false)}>
                        <Close fontSize="small" />
                      </CloseButton>
                      Edit your candidate’s profile here
                      <GotItButton onClick={() => setTooltipOpen(false)}>
                        GOT IT
                      </GotItButton>
                    </TooltipContent>
                  )}
                >
                  <EditProfileWrapper
                    onMouseEnter={() => setTooltipOpen(true)}
                    highlight={voterCanEditCandidateHighlight}
                  >
                    <EditOutlined fontSize="small" style={{ marginRight: 4 }} />
                    Edit profile
                  </EditProfileWrapper>
                </CustomTooltip>
              ) : (
                <>
                  <CandidateStaffAccessButton
                    onClick={handleOpenVerifyWithEmailModal}
                  >
                    Candidate staff access
                    <ExpandMoreRounded />
                  </CandidateStaffAccessButton>
                  <CandidateAccessWrapper>
                    Candidate staff access&nbsp;
                    <Caret>⌄</Caret>
                  </CandidateAccessWrapper>
                  {verifyWithEmailModalOpen()}
                  {verifyOtherWaysModalOpen()}
                </>
              )}
            </>
          ) : (
            <Suspense fallback={<></>}>
              <FlexLayoutDiv>
                <CandidateStaffText>
                  For candidate staff:&nbsp;
                </CandidateStaffText>
                <AddInfoLink>
                  <OpenExternalWebSite
                    linkIdAttribute="updateCandidateInformation"
                    url={updateCandidateInformationLink}
                    target="_blank"
                    className="u-link-color"
                    body={(
                      <div>
                        Add info
                      </div>
                    )}
                    destinationPageName="PoliticianEditForm"
                    destinationPageType="politician"
                    trackingOn
                  />
                </AddInfoLink>
              </FlexLayoutDiv>
            </Suspense>
          )}
        </>
      )}
    </UpdateInformationWrapper>
  );
};

UpdatePoliticianInformation.propTypes = {
  politicianName: PropTypes.string,
};

const AddInfoLink = styled('div')`
  font-size: 12px;
`;

const Caret = styled('span')`
  font-size: 12px;
`;

const CandidateAccessWrapper = styled('div')`
  font-size: 12px;
  color: ${DesignTokenColors.neutralUI100};
`;

const CandidateStaffText = styled('div')`
  color:${DesignTokenColors.neutralUI100};
  font-size: 10px;
`;

const EditProfileWrapper = styled('div')`
  color: ${DesignTokenColors.primary500};
  cursor: pointer;
  font-size: 12px;
`;

const FlexLayoutDiv = styled('div')`
  display: flex;
  align-items: flex-end;
`;

const UpdateInformationWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;
const TooltipContent = styled('div')`
  display: flex;
  flex-direction: column;
  position: relative;
`;
const GotItButton = styled(Button)`
  align-self: flex-end;
  color: #fff;
  font-size: 12px;
  text-transform: none;
  min-width: 0;
  white-space: nowrap;
`;
const CloseButton = muiStyled(IconButton)`
   align-self: flex-end;
   color: #fff;
   min-width: 0;
   padding: 0;
   z-index: 1;
 `;

const CandidateStaffAccessButton = styled('button')`
  background: transparent;
  border: none;
  color: ${DesignTokenColors.primary600};
  font-size: 12px;
`;

const VerifyModal = styled(Dialog)`
`;

const VerifyModalWrapper = styled('div')`
  padding: 22px;
  width: 535px
`;

const VerifyModalHeaderContainer = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  font-size: 18px;
`;

const VerifyModalHeaderContainerSmall = styled(VerifyModalHeaderContainer)`
  font-size: 16px;
`;

const VerifyHeaderText = styled('p')`
  margin: 0;
  padding: 0;
`;

const VerifyModalCloseButton = styled(IconButton)`
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
`;

const FlexColumnContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

const SelectPublicEmailsText = styled('p')`
  font-size: 12px;
  margin: 0;
`;

const OtherWaysToVerifyButton = styled(CandidateStaffAccessButton)`
  margin: 0;
  padding: 0;
`;

const SelectPublicEmailsOptionsContainer = styled(FlexColumnContainer)`
  padding: 8px 0;
`;

const SectionTitle = styled('p')`
  font-size: 12px;
  font-weight: 600;
  margin: 0;
`;

const EmailOptionContainer = styled('div')`
  align-items: center;
  border: 1px solid ${DesignTokenColors.neutralUI100};
  border-radius: 8px;
  box-shadow: ${standardBoxShadow()};
  display: flex;
  height: 55px;
  margin: 4px 0 4px 0;
  padding: 0 8px;

  &:hover {
    background-color: ${DesignTokenColors.neutral50};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Shadow effect on hover */
  }
`;

const EmailOptionText = styled('label')`
  align-items: center;
  display: flex;
  font-size: 12px;
  margin: 0;
  padding: 0;
`;

const EmailOptionCheckbox = styled('input')`
  appearance: none;
  -webkit-appearance: none;
  background-color: white;
  border: 1px solid black;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 8px;
  position: relative;

  &:checked::after {
    content: '';
    display: block;
    position: absolute;
    left: 1px;
    top: 1px;
    width: 8px;
    height: 8px;
    background: ${DesignTokenColors.primary600};
    border-radius: 50%;
  }
`;

const SelectPublicEmailsVerificationButton = styled('button')`
  border: none;
  border-radius: 20px;
  color: white;
  background-color: ${DesignTokenColors.primary600};
  font-size: 12px;
  height: 40px;
  margin: 12px 0 2px 0;

  &:disabled {
    color: ${DesignTokenColors.neutralUI600};
    background-color: ${DesignTokenColors.neutralUI100};
  }
`;

const SectionDivider = styled('hr')`
  border-top: 1px solid ${DesignTokenColors.neutralUI100};
  width: 100%;
`;


const PasskeyVerificationInput = styled('input')`
  border: 1px solid ${DesignTokenColors.neutralUI100};
  border-radius: 4px;
  font-size: 14px;
  height: 40px;
  margin: 8px 0 2px 0;
  padding: 0 8px;
`;

const OtherWaysToVerifyContainer = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const OtherWaysToVerifyButtonLarge = styled(OtherWaysToVerifyButton)`
  font-weight: 700;
  margin: 8px 0;
`;

const VerifyModalSectionWrapper = styled('div')`
  align-items: center;
  display: flex;
`;

const VerifyStepNumber = styled('div')`
  align-items: center;
  background-color: ${DesignTokenColors.neutralUI600};
  border-radius: 50%;
  color: white;
  display: flex;
  font-size: 14px;
  height: 24px;
  justify-content: center;
  width: 24px;
`;

const RelationshipOptionsContainer = styled(FlexColumnContainer)`
  margin-left: 35px;
`;

export default UpdatePoliticianInformation;
