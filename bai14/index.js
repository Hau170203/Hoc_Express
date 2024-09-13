const express = require('express')
const app = express()
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bebuoi1')
  .then(() => console.log('Kết nối thành công với MongoDB'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));
const port = 3001

const Products = mongoose.model('Products', {
  title: String,
  thumbnail: String
});
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('Home', {
    title: 'Trang chủ'
  })
});

app.get('/products', async (req, res) => {
  const Product = await Products.find({});
  console.log(Product);
  res.render('Products', {
    title: 'Trang Products'
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})