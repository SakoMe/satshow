import 'express-async-errors';

import { errorHandler, getCurrentUser, NotFoundError } from '@kythera/common';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express, { Application, json } from 'express';

// Auth
import {
  currentUserRouter,
  getUserRouter,
  signInRouter,
  signOutRouter,
  signUpRouter,
} from './features/auth/routes';
// Beams
import { getAllBasebandBeamsRouter } from './features/beams/routes/get-all-beams';
// Gateways
import { getAllGatewaysRouter } from './features/gateways/routes/get-all-gateways';
// Layers
import {
  layerBeamsRouter,
  layerGatewaysRouter,
  layerTerminalsRouter,
} from './features/layers/routes';
//Logs
import { getAllLogsRouter } from './features/logs/routes/get-all-logs';
// New Plan
import {
  createBeamRouter,
  createConnectivityRouter,
  createConstraintRouter,
  createGatewayModemRouter,
  createGatewayRouter,
  createManyBeamsRouter,
  createManyConnectivitiesRouter,
  createManyConstraintsRouter,
  createManyGatewayModemsRouter,
  createManyGatewaysRouter,
  createManyMethodTerminalsRouter,
  createManyRegionsRouter,
  createManyServiceParamsRouter,
  createManyTerminalsRouter,
  createMethodTerminalRouter,
  createPlanRouter,
  createRegionRouter,
  createServiceParamRouter,
  createServiceSegmentGroupRouter,
  createServiceSegmentRouter,
  createTerminalRouter,
  deleteBeamRouter,
  deleteConnectivityRouter,
  deleteConstraintRouter,
  deleteGatewayModemRouter,
  deleteGatewayRouter,
  deleteManyBeamsRouter,
  deleteManyConnectivitiesRouter,
  deleteManyConstraintsRouter,
  deleteManyGatewayModemsRouter,
  deleteManyGatewaysRouter,
  deleteManyMethodTerminalsRouter,
  deleteManyRegionsRouter,
  deleteManyServiceParamsRouter,
  deleteManyTerminalsRouter,
  deleteMethodTerminalRouter,
  deletePlanRouter,
  deleteRegionRouter,
  deleteServiceParamRouter,
  deleteServiceSegmentGroupRouter,
  deleteServiceSegmentRouter,
  deleteTerminalRouter,
  getAllSegmentGatewaysRouter,
  getAllSegmentTerminalsRouter,
  getAllServiceSegementsRouter,
  getAllServiceSegmentGroupsRouter,
  getGatewayRouter,
  getPlanRouter,
  getServiceSegmentGatewaysRouter,
  getServiceSegmentGroupRouter,
  getServiceSegmentRegionsRouter,
  getTerminalRouter,
  updateBeamRouter,
  updateConnectivityRouter,
  updateConstraintRouter,
  updateGatewayModemRouter,
  updateGatewayRouter,
  updateManyBeamsRouter,
  updateManyConnectivitiesRouter,
  updateManyConstraintsRouter,
  updateManyGatewayModemsRouter,
  updateManyGatewaysRouter,
  updateManyMethodTerminalsRouter,
  updateManyRegionsRouter,
  updateManyServiceParamsRouter,
  updateManyTerminalsRouter,
  updateMethodTerminalRouter,
  updatePlanRouter,
  updateRegionRouter,
  updateServiceParamRouter,
  updateServiceSegmentGroupRouter,
  updateServiceSegmentRouter,
  updateTerminalRouter,
} from './features/plan/routes';
// Rainviewer API
import { getRainViewerDataRouter } from './features/rain-viewer/routes/get-rain-data';
// Results
import { getKpisRouter, getLinkBudgetResultsRouter } from './features/results/routes';
// Terminals
import { getAllTerminalsRouter } from './features/terminals/routes/get-all-terminals';

const app: Application = express();

app.use(json());
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(cookieSession({ signed: false }));
app.use(getCurrentUser);

// AUTHENTICATION
app.use('/api/v1', currentUserRouter);
app.use('/api/v1', signUpRouter);
app.use('/api/v1', signInRouter);
app.use('/api/v1', signOutRouter);
app.use('/api/v1', getUserRouter);

/*
  CREATE A NEW PLAN
*/
// PLAN ROUTES
app.use('/api/v1', createPlanRouter);
app.use('/api/v1', updatePlanRouter);
app.use('/api/v1', deletePlanRouter);
app.use('/api/v1', getPlanRouter);

// SEGMENT GROUP ROUTES
app.use('/api/v1', createServiceSegmentGroupRouter);
app.use('/api/v1', updateServiceSegmentGroupRouter);
app.use('/api/v1', deleteServiceSegmentGroupRouter);
app.use('/api/v1', getAllServiceSegmentGroupsRouter);
app.use('/api/v1', getServiceSegmentGroupRouter);

// SERVICE SEGMENT ROUTES
app.use('/api/v1', createServiceSegmentRouter);
app.use('/api/v1', updateServiceSegmentRouter);
app.use('/api/v1', deleteServiceSegmentRouter);
app.use('/api/v1', getAllServiceSegementsRouter);

// REGION ROUTES
app.use('/api/v1', createRegionRouter);
app.use('/api/v1', updateRegionRouter);
app.use('/api/v1', deleteRegionRouter);
app.use('/api/v1', createManyRegionsRouter);
app.use('/api/v1', updateManyRegionsRouter);
app.use('/api/v1', deleteManyRegionsRouter);
app.use('/api/v1', getServiceSegmentRegionsRouter);

// SERVICE PARAM ROUTES
app.use('/api/v1', createServiceParamRouter);
app.use('/api/v1', updateServiceParamRouter);
app.use('/api/v1', deleteServiceParamRouter);
app.use('/api/v1', createManyServiceParamsRouter);
app.use('/api/v1', updateManyServiceParamsRouter);
app.use('/api/v1', deleteManyServiceParamsRouter);

// REGULATORY CONSTRAINT ROUTES
app.use('/api/v1', createConstraintRouter);
app.use('/api/v1', updateConstraintRouter);
app.use('/api/v1', deleteConstraintRouter);
app.use('/api/v1', createManyConstraintsRouter);
app.use('/api/v1', updateManyConstraintsRouter);
app.use('/api/v1', deleteManyConstraintsRouter);

// CANDIDATE BEAM ROUTES
app.use('/api/v1', createBeamRouter);
app.use('/api/v1', updateBeamRouter);
app.use('/api/v1', deleteBeamRouter);
app.use('/api/v1', createManyBeamsRouter);
app.use('/api/v1', updateManyBeamsRouter);
app.use('/api/v1', deleteManyBeamsRouter);

// GATEWAY ROUTES
app.use('/api/v1', createGatewayRouter);
app.use('/api/v1', updateGatewayRouter);
app.use('/api/v1', deleteGatewayRouter);
app.use('/api/v1', createManyGatewaysRouter);
app.use('/api/v1', updateManyGatewaysRouter);
app.use('/api/v1', deleteManyGatewaysRouter);
app.use('/api/v1', getGatewayRouter);
app.use('/api/v1', getAllSegmentGatewaysRouter);
app.use('/api/v1', getServiceSegmentGatewaysRouter);

// GATEWAY MODEM ROUTES
app.use('/api/v1', createGatewayModemRouter);
app.use('/api/v1', updateGatewayModemRouter);
app.use('/api/v1', deleteGatewayModemRouter);
app.use('/api/v1', createManyGatewayModemsRouter);
app.use('/api/v1', deleteManyGatewayModemsRouter);
app.use('/api/v1', updateManyGatewayModemsRouter);

// TERMINAL ROUTES
app.use('/api/v1', createTerminalRouter);
app.use('/api/v1', updateTerminalRouter);
app.use('/api/v1', deleteTerminalRouter);
app.use('/api/v1', createManyTerminalsRouter);
app.use('/api/v1', updateManyTerminalsRouter);
app.use('/api/v1', deleteManyTerminalsRouter);

// METHOD TERMINAL ROUTES
app.use('/api/v1', createMethodTerminalRouter);
app.use('/api/v1', updateMethodTerminalRouter);
app.use('/api/v1', deleteMethodTerminalRouter);
app.use('/api/v1', createManyMethodTerminalsRouter);
app.use('/api/v1', updateManyMethodTerminalsRouter);
app.use('/api/v1', deleteManyMethodTerminalsRouter);
app.use('/api/v1', getTerminalRouter);
app.use('/api/v1', getAllSegmentTerminalsRouter);

// CONNECTIVITY ROUTES
app.use('/api/v1', createConnectivityRouter);
app.use('/api/v1', updateConnectivityRouter);
app.use('/api/v1', deleteConnectivityRouter);
app.use('/api/v1', createManyConnectivitiesRouter);
app.use('/api/v1', updateManyConnectivitiesRouter);
app.use('/api/v1', deleteManyConnectivitiesRouter);

/*
  RESULTS
*/
// KPI
app.use('/api/v1/data', getKpisRouter);
// LINK BUDGET
app.use('/api/v1/data', getLinkBudgetResultsRouter);

// BEAMS
app.use('/api/v1/data', getAllBasebandBeamsRouter);

// GATEWAYS
app.use('/api/v1/data', getAllGatewaysRouter);

// LOGS
app.use('/api/v1/data', getAllLogsRouter);

// TERMINALS
app.use('/api/v1/data', getAllTerminalsRouter);

// BEAMS LAYER
app.use('/api/v1/layers', layerBeamsRouter);

// TERMINALS LAYER
app.use('/api/v1/layers', layerTerminalsRouter);

// GATEWAYS LAYER
app.use('/api/v1/layers', layerGatewaysRouter);

// RAIN VIEWER
app.use('/api/v1', getRainViewerDataRouter);

app.all('*', () => {
  throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export default app;
