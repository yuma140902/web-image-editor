import ImageSelector from './components/ImageSelector';
import ImagePreview from './components/ImagePreview';
import {
  Button,
  Checkbox,
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
import { ReactNode, useEffect, useState } from 'react';
import { Project, renderProject } from './core/Project';
import MenuBar from './components/MenuBar';
import appIcon from '/icon-512×512.png';
import githubLightIcon from './github-mark.svg';
import githubDarkIcon from './github-mark-white.svg';
import QuickMenu from './components/QuickMenu';
import { GithubFilled } from '@ant-design/icons';
import ToolDrawer from './components/ToolDrawer';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

type Tool = 'binarization' | 'canny' | 'colored_canny' | 'manga' | 'contrast';

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

  const [currentTool, setCurrentTool] = useState<Tool | undefined>(undefined);

  const [binarizationThreshold, setBinarizationThreshold] = useState(100);

  const [cannyThreshold1, setCannyThreshold1] = useState(100);
  const [cannyThreshold2, setCannyThreshold2] = useState(200);

  const [coloredCannyThreshold1, setColoredCannyThreshold1] = useState(100);
  const [coloredCannyThreshold2, setColoredCannyThreshold2] = useState(200);

  const [mangaThreshold1, setMangaThreshold1] = useState(100);
  const [mangaThreshold2, setMangaThreshold2] = useState(200);

  const [contrastUseAlphaCh, setContrastUseAlphaCh] = useState(false);
  const [contrastAlpha, setContrastAlpha] = useState(1.0);
  const [contrastBeta, setContrastBeta] = useState(0);

  // Headerをライトテーマにするために必要
  // https://github.com/ant-design/ant-design/issues/25048
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(
    () => setProject((p) => ({ ...p, mat: mat, previewMat: undefined })),
    [mat],
  );

  const windowIsLandscape = (): boolean => windowWidth > windowHeight;

  const toolDrawerIsOpen = (): boolean => !!currentTool;
  const closeToolDrawer = () => setCurrentTool(undefined);
  const getToolName = (tool: Tool): string => {
    switch (tool) {
      case 'binarization':
        return '二値化';
      case 'canny':
        return 'エッジ検出 (Canny法)';
      case 'colored_canny':
        return '色付きエッジ検出 (Canny法)';
      case 'manga':
        return '漫画風加工 (Canny法)';
      case 'contrast':
        return 'コントラストと明るさ';
    }
  };
  const getToolComponent = (tool: Tool): ReactNode => {
    switch (tool) {
      case 'binarization':
        return (
          <>
            <Typography>閾値:</Typography>
            <Slider
              defaultValue={binarizationThreshold}
              max={255}
              marks={{ 0: 0, 255: 255 }}
              onAfterChange={setBinarizationThreshold}
            />
          </>
        );
      case 'canny':
        return (
          <>
            <Typography>閾値1:</Typography>
            <Slider
              defaultValue={cannyThreshold1}
              max={255}
              marks={{ 0: 0, 255: 255 }}
              onAfterChange={setCannyThreshold1}
            />
            <Typography>閾値2:</Typography>
            <Slider
              defaultValue={cannyThreshold2}
              max={255}
              marks={{ 0: 0, 255: 255 }}
              onAfterChange={setCannyThreshold2}
            />
          </>
        );
      case 'colored_canny':
        return (
          <>
            <Typography>閾値1:</Typography>
            <Slider
              defaultValue={coloredCannyThreshold1}
              max={255}
              marks={{ 0: 0, 255: 255 }}
              onAfterChange={setColoredCannyThreshold1}
            />
            <Typography>閾値2:</Typography>
            <Slider
              defaultValue={coloredCannyThreshold1}
              max={255}
              marks={{ 0: 0, 255: 255 }}
              onAfterChange={setColoredCannyThreshold2}
            />
          </>
        );
      case 'manga':
        return (
          <>
            <Typography>閾値1:</Typography>
            <Slider
              defaultValue={mangaThreshold1}
              max={255}
              marks={{ 0: 0, 255: 255 }}
              onAfterChange={setMangaThreshold1}
            />
            <Typography>閾値2:</Typography>
            <Slider
              defaultValue={mangaThreshold2}
              max={255}
              marks={{ 0: 0, 255: 255 }}
              onAfterChange={setMangaThreshold2}
            />
          </>
        );
      case 'contrast':
        return (
          <>
            <Checkbox
              defaultChecked={contrastUseAlphaCh}
              onChange={(e: CheckboxChangeEvent) =>
                setContrastUseAlphaCh(e.target.checked)
              }
            >
              画像の透明度を考慮する
              <wbr />
              （処理が重いので非推奨）
            </Checkbox>
            <Typography>コントラスト:</Typography>
            <Slider
              defaultValue={contrastAlpha}
              max={5}
              step={0.1}
              marks={{ 0: 0, 1: 1, 5: 5 }}
              onAfterChange={setContrastAlpha}
            />
            <Typography>明るさ:</Typography>
            <Slider
              defaultValue={contrastBeta}
              min={-255}
              max={255}
              marks={{ '-255': -255, 0: 0, 255: 255 }}
              onAfterChange={setContrastBeta}
            />
          </>
        );
    }
  };

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
    setCurrentTool('binarization');
    return;
  };

  const handleCanny = () => {
    setCurrentTool('canny');
    return;
  };

  const handleColoredCanny = () => {
    setCurrentTool('colored_canny');
  };

  const handleManga = () => {
    setCurrentTool('manga');
  };

  const handleInvert = () => {
    if (project.mat) {
      const dst = new cv.Mat();
      switch (project.mat.type()) {
        case cv.CV_8UC1:
          cv.bitwise_not(project.mat, dst);
          break;
        case cv.CV_8UC3:
        case cv.CV_8UC4: {
          const channels = new cv.MatVector();
          const ch0inv = new cv.Mat();
          const ch1inv = new cv.Mat();
          const ch2inv = new cv.Mat();
          const channelsInv = new cv.MatVector();
          cv.split(project.mat, channels);
          cv.bitwise_not(channels.get(0), ch0inv);
          cv.bitwise_not(channels.get(1), ch1inv);
          cv.bitwise_not(channels.get(2), ch2inv);
          channelsInv.push_back(ch0inv);
          channelsInv.push_back(ch1inv);
          channelsInv.push_back(ch2inv);
          channelsInv.push_back(channels.get(3));
          cv.merge(channelsInv, dst);

          channelsInv.delete();
          ch2inv.delete();
          ch1inv.delete();
          ch0inv.delete();
          channels.delete();
          break;
        }
      }
      project.mat.delete();
      project.mat = undefined;
      setProject({ ...project, mat: dst });
      setProjectHasChanges(true);
    }
  };

  const handleContrast = () => {
    closeToolDrawer();
    setCurrentTool('contrast');
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

    if (currentTool === 'binarization' && !isProcessingPreview) {
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
  }, [binarizationThreshold, currentTool, isProcessingPreview]);

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

    if (currentTool === 'canny' && !isProcessingPreview) {
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
  }, [cannyThreshold1, cannyThreshold2, currentTool, isProcessingPreview]);

  useEffect(() => {
    const convert = async (
      input: cv.Mat,
      threshold1: number,
      threshold2: number,
    ): Promise<cv.Mat> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const output = new cv.Mat();
          const edge = new cv.Mat();
          cv.Canny(input, edge, threshold1, threshold2);
          if (input.type() === cv.CV_8UC1) {
            cv.bitwise_not(edge, output);
          } else if (input.type() === cv.CV_8UC3) {
            const edgeInv = new cv.Mat();
            const edgeInvCh = new cv.Mat();
            cv.bitwise_not(edge, edgeInv);
            cv.cvtColor(edgeInv, edgeInvCh, cv.COLOR_GRAY2BGR);
            cv.add(input, edgeInvCh, output);
            edgeInvCh.delete();
            edgeInv.delete();
          } else if (input.type() === cv.CV_8UC4) {
            const edgeInv = new cv.Mat();
            const edgeInvCh = new cv.Mat();
            cv.bitwise_not(edge, edgeInv);
            cv.cvtColor(edgeInv, edgeInvCh, cv.COLOR_GRAY2BGRA);
            cv.add(input, edgeInvCh, output);
            edgeInvCh.delete();
            edgeInv.delete();
          }
          edge.delete();
          resolve(output);
        }, 0);
      });
    };

    if (currentTool === 'colored_canny' && !isProcessingPreview) {
      setIsProcessingPreview(true);
      if (project.mat) {
        convert(
          project.mat,
          coloredCannyThreshold1,
          coloredCannyThreshold2,
        ).then((dst) => {
          setIsProcessingPreview(false);
          project.previewMat?.delete();
          project.previewMat = undefined;
          setProject({ ...project, previewMat: dst });
        });
      }
    }
  }, [
    coloredCannyThreshold1,
    coloredCannyThreshold2,
    currentTool,
    isProcessingPreview,
  ]);

  useEffect(() => {
    const convert = async (
      input: cv.Mat,
      threshold1: number,
      threshold2: number,
    ): Promise<cv.Mat> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const output = new cv.Mat();
          const edge = new cv.Mat();
          cv.Canny(input, edge, threshold1, threshold2);
          if (input.type() === cv.CV_8UC1) {
            cv.subtract(input, edge, output);
          } else if (input.type() === cv.CV_8UC3) {
            const edgeCh = new cv.Mat();
            cv.cvtColor(edge, edgeCh, cv.COLOR_GRAY2BGR);
            cv.subtract(input, edgeCh, output);
            edgeCh.delete();
          } else if (input.type() === cv.CV_8UC4) {
            const edgeCh = new cv.Mat();
            const input3Ch = new cv.Mat();
            cv.cvtColor(edge, edgeCh, cv.COLOR_GRAY2BGR);
            cv.cvtColor(input, input3Ch, cv.COLOR_BGRA2BGR);
            cv.subtract(input3Ch, edgeCh, output);
            input3Ch.delete();
            edgeCh.delete();
          }
          edge.delete();
          resolve(output);
        }, 0);
      });
    };

    if (currentTool === 'manga' && !isProcessingPreview) {
      setIsProcessingPreview(true);
      if (project.mat) {
        convert(project.mat, mangaThreshold1, mangaThreshold2).then((dst) => {
          setIsProcessingPreview(false);
          project.previewMat?.delete();
          project.previewMat = undefined;
          setProject({ ...project, previewMat: dst });
        });
      }
    }
  }, [mangaThreshold1, mangaThreshold2, currentTool, isProcessingPreview]);

  useEffect(() => {
    const convert = async (
      input: cv.Mat,
      alpha: number,
      beta: number,
    ): Promise<cv.Mat> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            const output = new cv.Mat();
            let inputCvt = new cv.Mat();
            if (!contrastUseAlphaCh) {
              cv.cvtColor(input, inputCvt, cv.COLOR_BGRA2BGR);
            } else {
              inputCvt = input.clone();
            }
            if (inputCvt.type() === cv.CV_8UC4) {
              // 透明度を考慮した変換処理
              const inputChannels = new cv.MatVector();
              const inputColorChannels = new cv.MatVector();
              const inputColor = new cv.Mat();
              const outputColor = new cv.Mat();
              const outputColorChannels = new cv.MatVector();
              const outputChannels = new cv.MatVector();
              cv.split(inputCvt, inputChannels);
              inputColorChannels.push_back(inputChannels.get(0));
              inputColorChannels.push_back(inputChannels.get(1));
              inputColorChannels.push_back(inputChannels.get(2));
              cv.merge(inputColorChannels, inputColor);
              cv.convertScaleAbs(inputColor, outputColor, alpha, beta);
              cv.split(outputColor, outputColorChannels);
              outputChannels.push_back(outputColorChannels.get(0));
              outputChannels.push_back(outputColorChannels.get(1));
              outputChannels.push_back(outputColorChannels.get(2));
              outputChannels.push_back(inputChannels.get(3));
              cv.merge(outputChannels, output);
              outputChannels.delete();
              outputColorChannels.delete();
              outputColor.delete();
              inputColor.delete();
              inputColorChannels.delete();
              inputChannels.delete();
            } else {
              cv.convertScaleAbs(inputCvt, output, alpha, beta);
            }
            inputCvt.delete();
            resolve(output);
          } catch (e) {
            console.error(e);
          }
        }, 0);
      });
    };

    if (currentTool === 'contrast' && !isProcessingPreview) {
      setIsProcessingPreview(true);
      if (project.mat) {
        convert(project.mat, contrastAlpha, contrastBeta).then((dst) => {
          setIsProcessingPreview(false);
          project.previewMat?.delete();
          project.previewMat = undefined;
          setProject({ ...project, previewMat: dst });
        });
      }
    }
  }, [
    contrastUseAlphaCh,
    contrastAlpha,
    contrastBeta,
    currentTool,
    isProcessingPreview,
  ]);

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
            handleColoredCanny={handleColoredCanny}
            handleManga={handleManga}
            handleInvert={handleInvert}
            handleContrast={handleContrast}
          />
          <Space>
            <Spin spinning={isProcessingPreview} />
          </Space>
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
                  (windowIsLandscape() && toolDrawerIsOpen() ? DRAWER_SIZE : 0)
                }
                height={
                  windowHeight -
                  HEADER_HEIGHT -
                  (!windowIsLandscape() && toolDrawerIsOpen() ? DRAWER_SIZE : 0)
                }
                rightOffset={
                  windowIsLandscape() && toolDrawerIsOpen() ? DRAWER_SIZE : 0
                }
                bottomOffset={
                  !windowIsLandscape() && toolDrawerIsOpen() ? DRAWER_SIZE : 0
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
            閉じる
          </Button>
        }
      >
        <Result
          icon={
            <img src={appIcon} style={{ maxWidth: '100%', height: 'auto' }} />
          }
          title="Web Image Editor"
          extra={
            <>
              <GithubFilled />
              <Typography.Link>yuma140902/web-image-editor</Typography.Link>
              <br />
              <Typography.Text type="secondary">作者: yuma14</Typography.Text>
              <br />
              <Typography.Text type="secondary">
                バージョン: {`${__COMMIT_ID__} (${__GIT_BRANCH__} ブランチ)`}
              </Typography.Text>
            </>
          }
        />
      </Modal>

      <ToolDrawer
        title={currentTool ? getToolName(currentTool) : 'ツールなし'}
        open={toolDrawerIsOpen()}
        handleCancel={() => {
          disposePreview();
          closeToolDrawer();
        }}
        handleConfirm={() => {
          confirmPreview();
          closeToolDrawer();
        }}
      >
        {currentTool ? getToolComponent(currentTool) : undefined}
        <Spin spinning={isProcessingPreview} />
      </ToolDrawer>
    </ConfigProvider>
  );
}

export default App;
