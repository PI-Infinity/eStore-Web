import { BounceLoader } from "react-spinners";
import styled from "styled-components";
import { useTheme } from "../../../context/theme";

/**
 * Video uploading percentage component
 */

const UploaderPercentage = ({
  setLoading,
  progress,
  setProgress,
  cancelUpload,
}) => {
  const toggleLoader = () => {
    cancelUpload();
    setLoading(false);
    setProgress(0);
  };

  const { theme } = useTheme();

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <BackDrop>
        <LoaderContainer style={{ border: `1px solid ${theme.line}` }}>
          <BounceLoader size={20} color={theme.primary} />
          <div
            style={{
              color: theme.primaryText,
              letterSpacing: "0.5px",
              fontSize: "14px",
            }}
          >
            Uploading...
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "35px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ color: theme.primaryText }}>
              {progress?.toFixed(0)}
            </div>
            <div style={{ color: theme.primaryText }}>%</div>
          </div>
          <ProgressBarBackground>
            <ProgressBarFill
              style={{
                width: `${progress}%`,
                backgroundColor: theme.primary,
              }}
            />
          </ProgressBarBackground>
        </LoaderContainer>
        <div
          onClick={toggleLoader}
          style={{
            width: "40%",
            borderRadius: "50px",
            padding: "4px 16px",
            alignItems: "center",
            backgroundColor: theme.secondaryText,
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          Cancel
        </div>
      </BackDrop>
    </Container>
  );
};

export default UploaderPercentage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  position: fixed;
  z-index: 100999;
  background: rgba(0, 0, 0, 0.5);
  back-drop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
`;

const BackDrop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const LoaderContainer = styled.div`
  padding: 0 20px;
  width: 30vw;
  back-drop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
`;

const ProgressBarBackground = styled.div`
  width: 100px;
  height: 10px;
  background: #e0e0e0;
  border-radius: 10px;
`;
const ProgressBarFill = styled.div`
  height: 100%;
  border-radius: 10px;
`;
