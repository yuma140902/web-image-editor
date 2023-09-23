import ImageSelector from './components/ImageSelector';
import ImagePreview from './components/ImagePreview';
import {
  Button,
  ConfigProvider,
  Layout,
  Modal,
  Result,
  Slider,
  Space,
  Spin,
  Switch,
  Tooltip,
  Typography,
  theme,
} from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import cv from '@techstark/opencv-js';
import useCvMatFromFile from './hooks/useCvMatFromFile';
import { useWindowSize } from '@react-hook/window-size';
import { useEffect, useState } from 'react';
import { Project, renderProject } from './core/Project';
import MenuBar from './components/MenuBar';
import appIcon from './icon.png';
import githubLightIcon from './github-mark.svg';
import githubDarkIcon from './github-mark-white.svg';
import QuickMenu from './components/QuickMenu';
import { GithubFilled } from '@ant-design/icons';
import ToolDrawer from './components/ToolDrawer';

function App() {
  const [project, setProject] = useState<Project>({});
  const [projectIsOpened, setProjectIsOpened] = useState(false);
  const [projectHasChanges, setProjectHasChanges] = useState(false);
  const [mat, imageFile, setImageFile] = useCvMatFromFile();
  const [windowWidth, windowHeight] = useWindowSize();
  const HEADER_HEIGHT = 64;
  // AntdのDrawerのサイズは378で固定である
  // https://ant.design/components/drawer#api
  const DRAWER_SIZE = 378;
  // TODO: 永続化
  // TODO: ブラウザの設定をもとにデフォルト値を決める
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isProcessingPreview, setIsProcessingPreview] = useState(false);

  const [openAboutDialog, setOpenAboutDialog] = useState(false);

  const [openBinarizationDrawer, setOpenBinarizationDrawer] = useState(false);
  const [binarizationThreshold, setBinarizationThreshold] = useState(100);

  const [openCannyDrawer, setOpenCannyDrawer] = useState(false);
  const [cannyThreshold1, setCannyThreshold1] = useState(100);
  const [cannyThreshold2, setCannyThreshold2] = useState(200);

  // Headerをライトテーマにするために必要
  // https://github.com/ant-design/ant-design/issues/25048
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const windowIsLandscape = (): boolean => windowWidth > windowHeight;

  const anyToolDrawerIsOpen = (): boolean =>
    openBinarizationDrawer || openCannyDrawer;

  const closeAllToolDrawers = () => {
    setOpenBinarizationDrawer(false);
    setOpenCannyDrawer(false);
  };

  useEffect(
    () => setProject((p) => ({ ...p, mat: mat, previewMat: undefined })),
    [mat],
  );

  const handleGrayscale = () => {
    if (project.mat) {
      const imgGray = new cv.Mat();
      cv.cvtColor(project.mat, imgGray, cv.COLOR_BGR2GRAY);
      project.mat.delete();
      project.mat = undefined;
      setProject({ ...project, mat: imgGray });
      setProjectHasChanges(true);
    }
  };

  const handleBinarization = () => {
    closeAllToolDrawers();
    setOpenBinarizationDrawer(!openBinarizationDrawer);
    return;
  };

  const handleCanny = () => {
    closeAllToolDrawers();
    setOpenCannyDrawer(!openCannyDrawer);
    return;
  };

  useEffect(() => {
    const convert = async (
      input: cv.Mat,
      threshold: number,
    ): Promise<cv.Mat> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const dst = new cv.Mat();
          cv.threshold(input, dst, threshold, 255, cv.THRESH_BINARY);
          resolve(dst);
        }, 0);
      });
    };

    if (openBinarizationDrawer && !isProcessingPreview) {
      setIsProcessingPreview(true);
      if (project.mat) {
        convert(project.mat, binarizationThreshold).then((dst) => {
          setIsProcessingPreview(false);
          project.previewMat?.delete();
          project.previewMat = undefined;
          setProject({ ...project, previewMat: dst });
        });
      }
    }
  }, [binarizationThreshold, openBinarizationDrawer, isProcessingPreview]);

  useEffect(() => {
    const convert = async (
      input: cv.Mat,
      threshold1: number,
      threshold2: number,
    ): Promise<cv.Mat> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const dst = new cv.Mat();
          cv.Canny(input, dst, threshold1, threshold2);
          resolve(dst);
        }, 0);
      });
    };

    if (openCannyDrawer && !isProcessingPreview) {
      setIsProcessingPreview(true);
      if (project.mat) {
        convert(project.mat, cannyThreshold1, cannyThreshold2).then((dst) => {
          setIsProcessingPreview(false);
          project.previewMat?.delete();
          project.previewMat = undefined;
          setProject({ ...project, previewMat: dst });
        });
      }
    }
  }, [cannyThreshold1, cannyThreshold2, openCannyDrawer, isProcessingPreview]);

  const disposePreview = () => {
    setIsProcessingPreview(false);
    setProject((p) => {
      p.previewMat?.delete();
      p.previewMat = undefined;
      return { ...p, previewMat: undefined };
    });
  };

  const confirmPreview = () => {
    setProject((p) => ({
      ...p,
      mat: p.previewMat,
      previewMat: undefined,
    }));
    setProjectHasChanges(true);
  };

  const handleSave = async () => {
    // https://konvajs.org/docs/data_and_serialization/High-Quality-Export.html
    const downloadURI = (uri: string, filename: string) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const stage = await renderProject(project);
    const dataUrl = stage.toDataURL({
      pixelRatio: 1,
      mimeType: 'image/png',
      x: 0,
      y: 0,
      width: project.mat?.cols,
      height: project.mat?.rows,
    });
    downloadURI(dataUrl, imageFile?.name ?? 'output.png');
    setProjectHasChanges(false);
  };

  const handleClose = () => {
    project.mat?.delete();
    project.mat = undefined;
    project.previewMat?.delete();
    project.previewMat = undefined;
    setProject({});
    setProjectIsOpened(false);
    setProjectHasChanges(false);
  };

  const handleOpenAboutDialog = () => {
    setOpenAboutDialog(true);
  };

  const handleCloseAboutDialog = () => {
    setOpenAboutDialog(false);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Layout: {
            headerHeight: HEADER_HEIGHT,
          },
        },
      }}
    >
      <Layout style={{ height: '100%' }}>
        <Header
          style={{
            ...{
              width: '100%',
              display: 'flex',
              paddingLeft: '0',
              paddingRight: '3px',
            },
            // https://github.com/ant-design/ant-design/issues/25048
            ...(isDarkMode ? {} : { background: colorBgContainer }),
          }}
        >
          <a href="#" role="button" onClick={handleOpenAboutDialog}>
            <img
              src={appIcon}
              height={HEADER_HEIGHT}
              style={{
                marginLeft: '10px',
                marginRight: '10px',
              }}
            />
          </a>
          <a href="#" role="button" onClick={handleOpenAboutDialog}>
            <Space>
              <Typography.Text hidden={windowWidth < 500} strong>
                Web Image Editor
              </Typography.Text>
            </Space>
          </a>
          <MenuBar
            projectIsOpened={projectIsOpened}
            isDarkMode={isDarkMode}
            hasUnsavedChanges={projectHasChanges}
            handleSave={handleSave}
            handleClose={handleClose}
            handleGrayscale={handleGrayscale}
            handleBinarization={handleBinarization}
            handleCanny={handleCanny}
          />
          <Space style={{ float: 'right', marginLeft: 'auto' }}>
            <Switch
              checkedChildren="Dark"
              unCheckedChildren="Light"
              checked={isDarkMode}
              onChange={(checked) => setIsDarkMode(checked)}
            />
          </Space>
          <Tooltip title="View on GitHub">
            <a
              href="https://github.com/yuma140902/web-image-editor"
              target="_blank"
            >
              <div
                style={{
                  height: '64px',
                  marginLeft: '10px',
                  marginRight: '10px',
                }}
              >
                <img
                  src={isDarkMode ? githubDarkIcon : githubLightIcon}
                  height={24}
                  style={{ verticalAlign: 'middle' }}
                />
              </div>
            </a>
          </Tooltip>
        </Header>
        <Content>
          {!projectIsOpened ? (
            <div style={{ padding: '2rem', height: '100%' }}>
              <ImageSelector
                handleImageFile={(file) => {
                  setImageFile(file);
                  setProjectIsOpened(true);
                }}
              />
            </div>
          ) : (
            <>
              <QuickMenu
                handleSave={handleSave}
                hasUnsavedChanges={projectHasChanges}
              />
              <ImagePreview
                project={project}
                width={
                  windowWidth -
                  (windowIsLandscape() && anyToolDrawerIsOpen()
                    ? DRAWER_SIZE
                    : 0)
                }
                height={
                  windowHeight -
                  HEADER_HEIGHT -
                  (!windowIsLandscape() && anyToolDrawerIsOpen()
                    ? DRAWER_SIZE
                    : 0)
                }
                rightOffset={
                  windowIsLandscape() && anyToolDrawerIsOpen() ? DRAWER_SIZE : 0
                }
                bottomOffset={
                  !windowIsLandscape() && anyToolDrawerIsOpen()
                    ? DRAWER_SIZE
                    : 0
                }
                isDarkMode={isDarkMode}
              />
            </>
          )}
        </Content>
      </Layout>
      <Modal
        open={openAboutDialog}
        closable={false}
        onCancel={handleCloseAboutDialog}
        onOk={handleCloseAboutDialog}
        footer={
          <Button type="default" onClick={handleCloseAboutDialog}>
            OK
          </Button>
        }
      >
        <Result
          icon={<img src={appIcon} />}
          title="Web Image Editor"
          extra={
            <>
              <Typography.Text type="secondary">Author: yuma14</Typography.Text>
              <br />
              <GithubFilled />
              <Typography.Link>yuma140902/web-image-editor</Typography.Link>
            </>
          }
        />
      </Modal>
      <ToolDrawer
        title="二値化"
        open={openBinarizationDrawer}
        handleCancel={() => {
          disposePreview();
          setOpenBinarizationDrawer(false);
        }}
        handleConfirm={() => {
          confirmPreview();
          setOpenBinarizationDrawer(false);
        }}
      >
        <Typography>閾値:</Typography>
        <Slider
          defaultValue={binarizationThreshold}
          max={255}
          onChange={(num) => {
            setBinarizationThreshold(num);
          }}
        />
        {isProcessingPreview ? <Spin /> : undefined}
      </ToolDrawer>
      <ToolDrawer
        title="エッジ検出 (Canny法)"
        open={openCannyDrawer}
        handleCancel={() => {
          disposePreview();
          setOpenCannyDrawer(false);
        }}
        handleConfirm={() => {
          confirmPreview();
          setOpenCannyDrawer(false);
        }}
      >
        <Typography>閾値1:</Typography>
        <Slider
          defaultValue={cannyThreshold1}
          max={255}
          onChange={(num) => {
            setCannyThreshold1(num);
          }}
        />
        <Typography>閾値2:</Typography>
        <Slider
          defaultValue={cannyThreshold2}
          max={255}
          onChange={(num) => {
            setCannyThreshold2(num);
          }}
        />
        {isProcessingPreview ? <Spin /> : undefined}
      </ToolDrawer>
    </ConfigProvider>
  );
}

export default App;
