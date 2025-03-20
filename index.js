import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import schoolRoutes from './routes/schoolRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', schoolRoutes);

app.get('/', (req, res) => res.send('School Management API is running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));