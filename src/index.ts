import express, { type Application } from 'express';
import { sql } from 'drizzle-orm';
import swaggerUi from 'swagger-ui-express';
import { getDb } from './db/index.ts';
import { authRouter } from './routes/authRouter.ts';
import { stallRouter } from './routes/stallRouter.ts';
import { notFoundHandler } from './middlewares/notFound.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { openApiDocument } from './docs/openapi.ts';

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());

app.get('/docs/swagger.json', (_req, res) => {
  res.status(200).json(openApiDocument);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get('/health', async (_req, res) => {
  const db = await getDb();
  await db.execute(sql`SELECT 1 AS ok`);
  res.status(200).json({ status: 'success', message: 'Server dan database terhubung' });
});

// Dipasang di /api/v1/... (sesuai hands-on) dan di root /... (sesuai tabel soal Tugas 3)
app.use('/api/v1/auth', authRouter);
app.use('/auth', authRouter);

app.use('/api/v1/stalls', stallRouter);
app.use('/stalls', stallRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
