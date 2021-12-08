import express from 'express';

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
        res.status(200).json({ status: 'success', message: 'Welcome the Stock API! ' });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));

export default app;
