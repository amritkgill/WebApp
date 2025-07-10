import PropTypes from 'prop-types';
import React, { useState, Suspense } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import styled from 'styled-components';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled as muiStyled } from '@mui/material/styles';
import DesignTokenColors from '../Style/DesignTokenColors';

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

function UpdatePoliticianInformation (props) {
  const { politicianName } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const newDesign2025 = true;
  const voterCanEditCandidate = true; // This should be determined by the actual application logic
  const voterCanEditCandidateHighlight = false;

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
                        <CloseIcon fontSize="small" />
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
                    <EditOutlinedIcon fontSize="small" style={{ marginRight: 4 }} />
                    Edit profile
                  </EditProfileWrapper>
                </CustomTooltip>
              ) : (
                <CandidateAccessWrapper>
                  Candidate staff access&nbsp;
                  <Caret>⌄</Caret>
                </CandidateAccessWrapper>
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
}
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
const CloseButton = styled(IconButton)`
   align-self: flex-end;
   color: #fff;
   min-width: 0;
   padding: 0;
   z-index: 1;
 `;

export default UpdatePoliticianInformation;
