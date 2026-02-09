import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
async function start() {
  try {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  Starting Server...                   ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    app.listen(PORT, () => {
      console.log(`\n╔════════════════════════════════════════╗`);
      console.log(`║  ✅ Server Running                     ║`);
      console.log(`║  http://localhost:${PORT}                    ║`);
      console.log(`╚════════════════════════════════════════╝\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();
