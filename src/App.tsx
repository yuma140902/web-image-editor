import ImageSelector from './components/ImageSelector';
import ImagePreview from './components/ImagePreview';
import {
  Button,
  ConfigProvider,
  Drawer,
  Layout,
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

function App() {
  const [project, setProject] = useState<Project>({});
  const [mat, imageFile, setImageFile] = useCvMatFromFile();
  const [windowWidth, windowHeight] = useWindowSize();
  const headerHeight = 64;
  // TODO: 永続化
  // TODO: ブラウザの設定をもとにデフォルト値を決める
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isProcessingPreview, setIsProcessingPreview] = useState(false);

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
    }
  };

  const handleBinarization = () => {
    setOpenBinarizationDrawer(!openBinarizationDrawer);
    return;
  };

  const handleCanny = () => {
    setOpenCannyDrawer(!openCannyDrawer);
    return;
  };

  // https://konvajs.org/docs/data_and_serialization/High-Quality-Export.html
  const downloadURI = (uri: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  };

  const handleSave = async () => {
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
  };

  const handleClose = () => {
    project.mat?.delete();
    project.mat = undefined;
    project.previewMat?.delete();
    project.previewMat = undefined;
    setProject({});
  };

  const projectIsOpened = (): boolean => !!project.mat;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Layout: {
            headerHeight: headerHeight,
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
          <img
            src={appIcon}
            height={headerHeight}
            style={{
              marginLeft: '10px',
              marginRight: '10px',
            }}
          />
          <Space>
            <Typography.Text strong>Web Image Editor</Typography.Text>
          </Space>
          <MenuBar
            projectIsOpened={projectIsOpened()}
            isDarkMode={isDarkMode}
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
                  height={28}
                  style={{ verticalAlign: 'middle' }}
                />
              </div>
            </a>
          </Tooltip>
        </Header>
        <Content>
          {!projectIsOpened() ? (
            <div style={{ padding: '2rem', height: '100%' }}>
              <ImageSelector handleImageFile={(file) => setImageFile(file)} />
            </div>
          ) : (
            <ImagePreview
              project={project}
              width={windowWidth}
              height={windowHeight - headerHeight}
              isDarkMode={isDarkMode}
            />
          )}
        </Content>
      </Layout>
      <Drawer
        title="二値化"
        open={openBinarizationDrawer}
        closable={false}
        onClose={() => {
          confirmPreview();
          setOpenBinarizationDrawer(false);
        }}
        placement="right"
        extra={
          <Space>
            <Button
              onClick={() => {
                disposePreview();
                setOpenBinarizationDrawer(false);
              }}
            >
              キャンセル
            </Button>
            <Button
              type="primary"
              onClick={() => {
                confirmPreview();
                setOpenBinarizationDrawer(false);
              }}
            >
              適用
            </Button>
          </Space>
        }
        maskStyle={{ background: 'transparent' }}
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
      </Drawer>
      <Drawer
        title="エッジ検出 (Canny法)"
        open={openCannyDrawer}
        closable={false}
        onClose={() => {
          confirmPreview();
          setOpenCannyDrawer(false);
        }}
        placement="right"
        extra={
          <Space>
            <Button
              onClick={() => {
                disposePreview();
                setOpenCannyDrawer(false);
              }}
            >
              キャンセル
            </Button>
            <Button
              type="primary"
              onClick={() => {
                confirmPreview();
                setOpenCannyDrawer(false);
              }}
            >
              適用
            </Button>
          </Space>
        }
        maskStyle={{ background: 'transparent' }}
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
      </Drawer>
    </ConfigProvider>
  );
}

export default App;
