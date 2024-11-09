import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});