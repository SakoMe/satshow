import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getLinkBudgetResults } from '../../services/linkBudgetResult';

const router = Router();

router.get(
  '/link-budget-result',
  requireAuth,
  async (_request: Request, response: Response) => {
    const linkBudgetResults = await getLinkBudgetResults();
    if (!linkBudgetResults) throw new NotFoundError('Link Budget Results not found');

    return response.status(200).json({ linkBudgetResults });
  },
);

export { router as getLinkBudgetResultsRouter };
