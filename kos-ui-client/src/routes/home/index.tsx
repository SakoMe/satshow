import { GeoBoundingBox } from '@deck.gl/geo-layers/typed';
import { GeoJsonLayer } from '@deck.gl/layers/typed';
import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed';
import * as KUI from '@kythera/kui-components';
import { BitmapLayer, TileLayer } from 'deck.gl/typed';
import { Resizable } from 're-resizable';
import { useState } from 'react';
import { useControl } from 'react-map-gl';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { store } from '../../app/store';
import logo from '../../assets/images/kos-logo.svg';
import { useGetKPIQuery } from '../../features/kpi/kpiSlice';
import { useGetLinkBudgetQuery } from '../../features/linkBudget/linkBudgetSlice';
import {
  highlightRow,
  SelectAllBeams,
  useGetAllBeamsLayerQuery,
} from '../../features/new_layers/beamsLayerSlice';
import {
  SelectAllGateways,
  useGetAllGatewaysLayerQuery,
} from '../../features/new_layers/gatewaysLayerSlice';
import {
  SelectAllTerminals,
  useGetAllTerminalsLayerQuery,
} from '../../features/new_layers/terminalsLayerSlice';
import { useGetRainViewerLayerQuery } from '../../features/rainViewer/rainViewerSlice';
import { MapContainer } from '../../styled/mapboxmap/MapboxMap';
import { ZoomContext } from '../../styled/mapboxmap/ZoomContext';
import { BottomBarContent } from './components/bottombar';
import {
  BodyContainer,
  BottomContainer,
  HeadContainer,
  HomeContainer,
  SideContainer,
} from './components/homelayout';
import { ServiceSequenceControl } from './components/servicesequence/ServiceSequenceControl';
import { SideBar } from './components/sideBar';
import { Panel } from './components/sideBar/panel';

function DeckGLOverlay(
  props: MapboxOverlayProps & {
    interleaved?: boolean;
  },
) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

export function Home() {
  const [newSequenceActive, setNewSequenceActive] = useState(false);
  const [showPolygons, setShowPolygons] = useState(false);
  const [zoom, setZoom] = useState(4);
  // Pass as a prop to the zoom controls in the sidebar. Pass 1 or -1 to increment the zoom percentage. Also returns the percentage number.
  const incrementZoom = (x: number) => {
    setZoom(Math.min(Math.max(zoom + x, 3), 10));
  };
  // Controls which dropdown is open.
  const [blockClicked, setBlockClicked] = useState<number | undefined>(undefined);
  // Run logic, like firing the modals.
  const handleBlockClick = (x: KUI.ValueItem) => {
    setBlockClicked(undefined);
    if (x.value === 'newplan') setNewSequenceActive(true);
    if (x.value === 'openplan') return null;
    if (x.value === 'newservice') return null;
    if (x.value === 'newservicerequest') return null;
    if (x.value === 'saveplan') return null;
    if (x.value === 'saveas') return null;
    return null;
  };
  // State for Home components
  const [selectedButton, setSelectedButton] = useState<number | undefined>(undefined);
  const [panelOpen, setPanelOpen] = useState(false);
  // const plan = useSelector((state: RootState) => state.plan);
  const SelectButton = (n: number | undefined) => {
    if (selectedButton === n || n === undefined) {
      setPanelOpen(false);
      setSelectedButton(undefined);
    } else {
      setPanelOpen(n !== undefined);
      setSelectedButton(n);
    }
  };
  const [path, setPath] = useState<string[]>([]);
  const [linkBudgetOpen, setLinkBudgetOpen] = useState(false);
  const { data: LBData } = useGetLinkBudgetQuery();

  const [renderCounter, setRenderCounter] = useState<number>(0);
  const [colorSetting, setColorSetting] = useState<
    { minVal: number; maxVal: number; color: string }[]
  >([]);
  const { data: BeamLayerData } = useGetAllBeamsLayerQuery(); // Calling this function triggers the query that adds beams to the store.
  const beams = SelectAllBeams(store.getState().beams);
  const dispatch = useDispatch();
  const beamsLayer = new GeoJsonLayer({
    data: beams,
    pickable: true,
    onClick(pickingInfo, event) {
      const multiPick = pickingInfo.layer?.context.deck?.pickMultipleObjects({
        x: pickingInfo.x,
        y: pickingInfo.y,
      });
      setRenderCounter((old) => old + 1);
      dispatch(highlightRow(multiPick?.at(0)?.object.properties.cell_id));
    },
    getFillColor: (accessor) => {
      const c = colorSetting.find(
        (c) =>
          (accessor.properties?.[path.at(-1)!] ?? -Infinity) >= c.minVal &&
          (accessor.properties?.[path.at(-1)!] ?? Infinity) <= c.maxVal,
      )?.color;
      if (c && !accessor.properties?.highlighted) {
        // deck.gl requires [r, g, b, a] format
        return [
          parseInt(c.slice(1, 3), 16),
          parseInt(c.slice(3, 5), 16),
          parseInt(c.slice(5, 7), 16),
          128,
        ];
      }
      return accessor.properties?.highlighted ? [65, 99, 71, 255] : [255, 255, 255, 128];
    },
    visible: showPolygons,
    updateTriggers: {
      getFillColor: [renderCounter, path, colorSetting],
      visible: [showPolygons],
    },
  });
  const { data: GatewayLayerData } = useGetAllGatewaysLayerQuery();
  const gateways = SelectAllGateways(store.getState().gateways);
  const gatewaysLayer = new GeoJsonLayer({
    id: 'gateways-layer',
    data: gateways,
    pointType: 'circle',
    getPointRadius: 15,
    pointRadiusMinPixels: 5,
    filled: true,
    getFillColor: [255, 255, 255, 255],
    visible: showPolygons,
    updateTriggers: { visible: [showPolygons] },
  });
  const { data: TerminalsLayerData } = useGetAllTerminalsLayerQuery();
  const terminals = SelectAllTerminals(store.getState().terminals);
  const { data: RainViewerLayerData } = useGetRainViewerLayerQuery();
  const RainViewerLayerCache = new TileLayer({
    id: 'rainviewer',
    data: process.env.PUBLIC_URL + '/rainViewerImages/rainviewer-5-{x}-{y}.png',

    maxZoom: 5,
    tileSize: 256,

    renderSubLayers: (props) => {
      const { west, south, east, north } = props.tile.bbox as GeoBoundingBox;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
        opacity: 0.7,
      });
    },
  });
  const terminalsLayer = new GeoJsonLayer({
    id: 'terminals-layer',
    data: terminals,
    pointType: 'circle',
    getPointRadius: 15,
    pointRadiusMinPixels: 5,
    filled: true,
    getFillColor: [255, 255, 255, 255],
    visible: showPolygons,
    updateTriggers: { visible: [showPolygons] },
  });
  const KPI = useGetKPIQuery();

  return (
    <HomeContainer>
      <HeadContainer>
        <button
          style={{
            appearance: 'none',
            border: 'none',
            backgroundColor: 'transparent',
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <img src={logo} alt={'KOS Logo'} style={{ height: '34px' }} />
          <KUI.Icon iconTitle={'nub arrow'} rotation={'up'} fill={'white'} size={1.8} />
        </button>
        <KUI.Dropdown
          items={[
            { label: 'New Plan', value: 'newplan' },
            { label: 'Open Plan', value: 'openplan' },
            { label: 'New Service', value: 'newservice' },
            { label: 'New Service Request', value: 'newservicerequest' },
            { label: 'Save Plan', value: 'saveplan' },
            { label: 'Save Plan As', value: 'saveas' },
          ]}
          open={[blockClicked === 0, () => null]}
          postReturnValue={(x) => handleBlockClick(x)}
          altButton={
            <KUI.ModeBlock
              onClick={() =>
                blockClicked !== 0 ? setBlockClicked(0) : setBlockClicked(undefined)
              }
              selected={blockClicked === 0}
            >
              <span
                style={{
                  ...KUI.theme.typoGraphy.action['T3-bold'],
                  height: 'min-content',
                }}
              >
                {'File'}
              </span>
            </KUI.ModeBlock>
          }
        />
        <KUI.Modal open={newSequenceActive}>
          <ServiceSequenceControl
            finish={(x) => {
              setNewSequenceActive(false);
              setShowPolygons(true);
              toast(`New segment created with id: ${x}`, {
                type: 'success',
                position: 'top-center',
              });
            }}
          />
        </KUI.Modal>
        <KUI.ModeBlock onClick={() => null} selected={false}>
          <span
            style={{
              ...KUI.theme.typoGraphy.action['T3-bold'],
            }}
          >
            {'Edit'}
          </span>
        </KUI.ModeBlock>
        <KUI.ModeBlock onClick={() => null} selected={false}>
          <span
            style={{
              ...KUI.theme.typoGraphy.action['T3-bold'],
            }}
          >
            {'Optimize'}
          </span>
        </KUI.ModeBlock>
        <KUI.Dropdown
          items={[
            { label: 'Overall Summary', value: 'summ' },
            { label: 'Link Budget', value: 'link' },
            { label: 'Graphs', value: 'g' },
          ]}
          open={[blockClicked === 4, () => null]}
          postReturnValue={(x) => (x.value === 'link' ? setLinkBudgetOpen(true) : null)}
          altButton={
            <KUI.ModeBlock
              onClick={() => setBlockClicked(4)}
              selected={blockClicked === 4}
            >
              <span
                style={{
                  ...KUI.theme.typoGraphy.action['T3-bold'],
                }}
              >
                {'Results'}
              </span>
            </KUI.ModeBlock>
          }
        />
        <KUI.Modal open={linkBudgetOpen}>
          <KUI.GridContainer
            style={{
              backgroundColor: KUI.theme.colors.greyScale[900],
              borderRadius: '8px',
              display: 'grid',
              placeItems: 'center',
              gridTemplateRows: 'max-content auto',
              height: '680px',
              width: '1594px',
            }}
          >
            <KUI.FlexContainer
              flexDirection="row"
              justifyContent="space-between"
              style={{
                width: '100%',
                padding: '16px 16px',
                alignContent: 'center',
                border: `1px solid ${KUI.theme.colors.greyScale[700]}`,
                borderRadius: '8px 8px 0 0',
              }}
            >
              <span
                style={{
                  ...KUI.theme.typoGraphy.heading['T4-bold'],
                  color: KUI.theme.colors.greyScale[200],
                }}
              >
                {'Link Budget'}
              </span>
              <KUI.ButtonIcon
                onClick={() => {
                  setLinkBudgetOpen(false);
                  setBlockClicked(undefined);
                }}
                iconTitle="close"
                variant="tertiary"
              />
            </KUI.FlexContainer>
            <KUI.Datatable
              data={LBData?.linkBudgetResults ?? []}
              setData={() => null}
              canFilter
              dataColumns={[
                { key: 'beam_id', type: 'string', header: 'Beam ID', pinned: true },
                {
                  key: 'terminal_id',
                  type: 'string',
                  header: 'Terminal ID',
                  pinned: true,
                },
                {
                  key: 'baseband_signal_id',
                  type: 'string',
                  header: 'Baseband Signal ID',
                  pinned: true,
                },
                { key: 'path', type: 'string', header: 'Link Path' },
                { key: 'uplink_eirp', type: 'string', header: 'Uplink EIRP' },
                { key: 'uplink_gain', type: 'string', header: 'Uplink Gain' },
                { key: 'uplink_g_over_t', type: 'string', header: 'Uplink G/T' },
                { key: 'uplink_path_loss', type: 'string', header: 'Uplink Path Loss' },
                { key: 'uplink_fade', type: 'string', header: 'Uplink Fade' },
                {
                  key: 'uplink_noise_bandwidth',
                  type: 'string',
                  header: 'Uplink Noise Bandwidth',
                },
                {
                  key: 'uplink_signal_power',
                  type: 'string',
                  header: 'Uplink Signal Power',
                },
                {
                  key: 'uplink_adjacent_beam_interference',
                  type: 'string',
                  header: 'Uplink Adjacent Interference',
                },
                {
                  key: 'uplink_rx_cross_pol_interference',
                  type: 'string',
                  header: 'Uplink RX Crosspol',
                },
                {
                  key: 'uplink_tx_cross_pol_interference',
                  type: 'string',
                  header: 'Uplink TX Crosspol',
                },
                { key: 'uplink_intermod', type: 'string', header: 'Uplink Intermod' },
                {
                  key: 'uplink_aggregate_c_over_i',
                  type: 'string',
                  header: 'Uplink C/I',
                },
                { key: 'downlink_eirp', type: 'string', header: 'Downlink EIRP' },
                { key: 'downlink_gain', type: 'string', header: 'Downlink Gain' },
                { key: 'downlink_g_over_t', type: 'string', header: 'Downlink G/T' },
                {
                  key: 'downlink_path_loss',
                  type: 'string',
                  header: 'Downlink Path Loss',
                },
                { key: 'downlink_fade', type: 'string', header: 'Downlink Fade' },
                {
                  key: 'downlink_noise_bandwidth',
                  type: 'string',
                  header: 'Downlink Noise Bandwidth',
                },
                {
                  key: 'downlink_signal_power',
                  type: 'string',
                  header: 'Downlink Signal Power',
                },
                {
                  key: 'downlink_adjacent_beam_interference',
                  type: 'string',
                  header: 'Downlink Adjacent Interference',
                },
                {
                  key: 'downlink_rx_cross_pol_interference',
                  type: 'string',
                  header: 'Downlink RX Crosspol',
                },
                {
                  key: 'downlink_tx_cross_pol_interference',
                  type: 'string',
                  header: 'Downlink TX Crosspol',
                },
                { key: 'downlink_intermod', type: 'string', header: 'Downlink Intermod' },
                {
                  key: 'downlink_aggregate_c_over_i',
                  type: 'string',
                  header: 'Downlink C/I',
                },
                { key: 'es_no', type: 'string', header: 'ESNO' },
                { key: 'bits_per_symbol', type: 'string', header: 'Bits Per Symbol' },
              ]}
              noRowsMessage={'No results to display.'}
            />
          </KUI.GridContainer>
        </KUI.Modal>
        <KUI.ModeBlock onClick={() => null} selected={false}>
          <span
            style={{
              ...KUI.theme.typoGraphy.action['T3-bold'],
            }}
          >
            {'Help'}
          </span>
        </KUI.ModeBlock>
        <span
          style={{
            ...KUI.theme.typoGraphy.paragraph['T3-regular'],
            color: KUI.theme.colors.greyScale[300],
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {''}
        </span>
      </HeadContainer>
      <SideContainer>
        <SideBar
          zoomControls={{ zoom: zoom, incrementZoom: incrementZoom }}
          selectButton={SelectButton}
          selectedButton={selectedButton}
        />
      </SideContainer>
      <BodyContainer>
        <Resizable
          style={{
            gridArea: 'resizable',
            display: panelOpen ? 'flex' : 'none',
            backgroundColor: KUI.theme.colors.greyScale[900],
            zIndex: 3,
            position: 'absolute',
          }}
          defaultSize={{ width: '320px', height: '100%' }}
          enable={{ right: true }}
          minWidth={'320px'}
          maxWidth={'600px'}
          as={'div'}
        >
          <KUI.FlexContainer
            flexDirection="column"
            alignItems="center"
            paddingBottom="12px"
            style={{ flex: '1' }}
          >
            <KUI.FlexContainer
              alignItems="center"
              paddingLeft="16px"
              paddingRight="16px"
              flexDirection="row"
              justifyContent="space-between"
              style={{
                width: '100%',
                height: '56px',
                color: 'white',
              }}
            >
              <span style={{ ...KUI.theme.typoGraphy.heading['T4-medium'] }}>
                {selectedButton === 0 ? 'Data Layers' : 'Header'}
              </span>
              <KUI.ButtonIcon
                onClick={() => SelectButton(undefined)}
                size={'L'}
                iconTitle="close"
                variant="tertiary"
              />
            </KUI.FlexContainer>
            <KUI.Divider extrapadding={-8} />
            {selectedButton === 0 && (
              <Panel>
                <KUI.Tree
                  object={{
                    label: 'Overall',
                    beams: {
                      label: 'Cells',
                      performance: {
                        label: 'Performance',
                        fwd_downlink: {
                          label: 'Fwd Downlink',
                          ci: {
                            label: 'C/I',
                            min_fwd_downlink_aggregate_c_over_i: { label: 'Minimum' },
                            avg_fwd_downlink_aggregate_c_over_i: { label: 'Average' },
                            max_fwd_downlink_aggregate_c_over_i: { label: 'Maximum' },
                          },
                          cn: {
                            label: 'C/N',
                            min_fwd_downlink_c_over_n: { label: 'Minimum' },
                            avg_fwd_downlink_c_over_n: { label: 'Average' },
                            max_fwd_downlink_c_over_n: { label: 'Maximum' },
                          },
                          esno: {
                            label: 'Es/N0',
                            min_fwd_es_over_no: { label: 'Minimum' },
                            avg_fwd_es_over_no: { label: 'Average' },
                            max_fwd_es_over_no: { label: 'Maximum' },
                          },
                          sat_eirp: {
                            label: 'Satellite EIRP',
                            min_fwd_downlink_eirp: { label: 'Minimum' },
                            avg_fwd_downlink_eirp: { label: 'Average' },
                            max_fwd_downlink_eirp: { label: 'Maximum' },
                          },
                          eirp_density: {
                            label: 'EIRP Density',
                            min_fwd_downlink_eirp_density: { label: 'Minimum' },
                            avg_fwd_downlink_eirp_density: { label: 'Average' },
                            max_fwd_downlink_eirp_density: { label: 'Maximum' },
                          },
                          spec: {
                            label: 'Spectral efficiency',
                            min_fwd_spectral_efficiency: { label: 'Mininum' },
                            avg_fwd_spectral_efficiency: { label: 'Average' },
                            max_fwd_spectral_efficiency: { label: 'Maximum' },
                          },
                          aggregate_fwd_allocated_capacity: {
                            label: 'Allocated capacity',
                          },
                          fwd_loading_ratio: { label: 'FWD Loading Ratio' },
                          fwd_channel_count: { label: 'FWD Channel Count' },
                          fwd_bandwidth_demand: { label: 'FWD Bandwidth Demand' },
                          fwd_polarization: { label: 'FWD Polarization' },
                          fwd_min_frequency: { label: 'Min Frequency' },
                          fwd_max_frequency: { label: 'Max Frequency' },
                          fwd_allocated_bandwidth: { label: 'Allocated' },
                          fwd_delta: { label: 'Delta' },
                        },
                        rtn_uplink: {
                          label: 'RTN Uplink',
                          ci: {
                            label: 'C/I',
                            min_rtn_downlink_aggregate_c_over_i: { label: 'Minimum' },
                            avg_rtn_downlink_aggregate_c_over_i: { label: 'Average' },
                            max_rtn_downlink_aggregate_c_over_i: { label: 'Maximum' },
                          },
                          cn: {
                            label: 'C/N',
                            min_rtn_downlink_c_over_n: { label: 'Minimum' },
                            avg_rtn_downlink_c_over_n: { label: 'Average' },
                            max_rtn_downlink_c_over_n: { label: 'Maximum' },
                          },
                          esno: {
                            label: 'Es/N0',
                            min_rtn_es_over_no: { label: 'Minimum' },
                            avg_rtn_es_over_no: { label: 'Average' },
                            max_rtn_es_over_no: { label: 'Maximum' },
                          },
                          sat_eirp: {
                            label: 'Satellite EIRP',
                            min_rtn_downlink_eirp: { label: 'Minimum' },
                            avg_rtn_downlink_eirp: { label: 'Average' },
                            max_rtn_downlink_eirp: { label: 'Maximum' },
                          },
                          spec: {
                            label: 'Spectral efficiency',
                            min_rtn_spectral_efficiency: { label: 'Mininum' },
                            avg_rtn_spectral_efficiency: { label: 'Average' },
                            max_rtn_spectral_efficiency: { label: 'Maximum' },
                          },
                          aggregate_rtn_allocated_capacity: {
                            label: 'Allocated capacity',
                          },
                          rtn_loading_ratio: { label: 'FWD Loading Ratio' },
                          rtn_channel_count: { label: 'RTN Channel Count' },
                          rtn_bandwidth_demand: { label: 'RTN Bandwidth Demand' },
                          rtn_polarization: { label: 'RTN Polarization' },
                          rtn_min_frequency: { label: 'Min Frequency' },
                          rtn_max_frequency: { label: 'Max Frequency' },
                          rtn_allocated_bandwidth: { label: 'Allocated' },
                          rtn_delta: { label: 'Delta' },
                        },
                      },
                      freq_plan: {
                        label: 'Frequency Plan',
                      },
                    },
                    comp_grid_pts: {
                      label: 'Computational Grid Points',
                      fwd_down: {
                        label: 'FWD Downlink',
                        avg_fwd_downlink_eirp: { label: 'Satellite EIRP' },
                        fwd_satellite_eirp_density: { label: 'Satellite EIRP Density' },
                        fwd_directivity: { label: 'Directivity' },
                        fwd_c_over_i: { label: 'C/I' },
                        fwd_terminal_g_over_t: { label: 'Terminal G/T' },
                        fwd_c_over_n: { label: 'C/N' },
                        avg_fwd_es_over_no: { label: 'Es/N0' },
                        avg_fwd_spectral_efficiency: { label: 'Spectral efficiency' },
                        fwd_bandwidth_demand: { label: 'Bandwidth Demand' },
                        fwd_allocated_bandwidth: { label: 'Allocated Bandwidth' },
                        fwd_bandwidth_delta: { label: 'Bandwidth Delta' },
                        fwd_loading_ratio: { label: 'Loading Ratio' },
                        fwd_allocated_capacity: { label: 'Allocated Capacity' },
                      },
                      rtn_up: {
                        label: 'RTN Uplink',
                        rtn_satellite_g_over_t: { label: 'Satellite G/T' },
                        rtn_directivity: { label: 'Directivity' },
                        rtn_c_over_i: { label: 'C/I' },
                        avg_rtn_uplink_eirp: { label: 'Terminal EIRP' },
                        rtn_terminal_eirp_density: { label: 'Terminal EIRP Density' },
                        rtn_c_over_n: { label: 'C/N' },
                        avg_rtn_es_over_no: { label: 'Es/N0' },
                        avg_rtn_spectral_efficiency: { label: 'Spectral efficiency' },
                        rtn_bandwidth_demand: { label: 'Bandwidth Demand' },
                        rtn_allocated_bandwidth: { label: 'Allocated Bandwidth' },
                        rtn_bandwidth_delta: { label: 'Bandwidth Delta' },
                        rtn_loading_ratio: { label: 'Loading Ratio' },
                        rtn_allocated_capacity: { label: 'Allocated Capacity' },
                      },
                    },
                    regions: {
                      label: 'Regions',
                      fwd: {
                        label: 'Forward',
                        avg_fwd_c_over_i: { label: 'Avg C/I' },
                        avg_fwd_allocated_capacity: { label: 'Allocated Capacity' },
                        fwd_aggregate_bandwidth: { label: 'Aggregate Bandwidth' },
                        fwd_aggregate_allocated_bandwidth: {
                          label: 'Aggregate Allocated Bandwidth',
                        },
                        avg_fwd_required_capacity: { label: 'Demand' },
                        fwd_loading_ratio: { label: 'Loading Ratio' },
                      },
                      rtn: {
                        label: 'Return',
                        avg_rtn_c_over_i: { label: 'Avg C/I' },
                        avg_rtn_allocated_capacity: { label: 'Allocated Capacity' },
                        rtn_aggregate_bandwidth: { label: 'Aggregate Bandwidth' },
                        rtn_aggregate_allocated_bandwidth: {
                          label: 'Aggregate Allocated Bandwidth',
                        },
                        avg_rtn_required_capacity: { label: 'Demand' },
                        rtn_loading_ratio: { label: 'Loading Ratio' },
                      },
                      avg_satellite_eirp: { label: 'Avg Satellite EIRP' },
                      avg_eirp_density: { label: 'Avg EIRP Density' },
                      avg_satellite_g_over_t: { label: 'Avg Satellite G/T' },
                    },
                  }}
                  selectionPath={path}
                  returnSelected={(y) => setPath(y)}
                  returnRightClicked={() => null}
                />
              </Panel>
            )}
            {selectedButton === 1 && (
              <Panel>
                <KUI.DraggableList
                  items={[
                    {
                      buttons: [{ icon: 'beam large', onClick: () => null }],
                      icon: 'add',
                      label: 'tets',
                    },
                  ]}
                  setItems={() => null}
                />
              </Panel>
            )}
            {selectedButton === 2 && <Panel>Hello World 3</Panel>}
          </KUI.FlexContainer>
        </Resizable>
        <ZoomContext.Provider
          value={{ level: zoom, setLevel: (x: number) => setZoom(x) }}
        >
          <MapContainer>
            <DeckGLOverlay
              id="rainviewer"
              interleaved={false}
              layers={[RainViewerLayerCache, beamsLayer, gatewaysLayer, terminalsLayer]}
            />
          </MapContainer>
        </ZoomContext.Provider>
        <div
          style={{
            position: 'absolute',
            right: 0,
            marginRight: '16px',
            bottom: 0,
            marginBottom: '16px',
            zIndex: 3,
          }}
        >
          <KUI.Legend
            postRangeData={(steps) => setColorSetting(steps)}
            rangeTitle={path.at(-1)}
          />
        </div>
      </BodyContainer>
      <BottomContainer>
        <BottomBarContent />
      </BottomContainer>
    </HomeContainer>
  );
}
