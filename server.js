import express from 'express';
import router from './routes';
import logger from 'morgan';
import mongoose from 'mongoose';

const app = express();

mongoose.connect(`mongodb+srv://galaxy4276:chldmsrl12@cluster0.v29j3.mongodb.net/hello?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('mongodb connected'))
  .catch(err => console.error(err));

app.set('host', 'localhost');
app.set('port', 8080);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('안녕하세요.');
});

app.use('/api/products', router);

app.listen(app.get('port'), app.set('host'), () => {
  console.log(`Running on http://${app.get('host')}:${app.get('port')}`);
});