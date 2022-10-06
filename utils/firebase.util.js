const { initializeApp } = require("firebase/app");
const dotenv = require("dotenv");
const {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref,
} = require("firebase/storage");
const { ProductImg } = require("../models/productImg.model");

dotenv.config({ path: "./config.env" });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const uploadProductImgs = async (imgs, productId) => {
  const imgsPromises = imgs.map(async (img) => {
    const [originalName, ext] = img.originalname.split(".");

    const filename = `products/${productId}/${originalName}-${Date.now()}.${ext}`;
    const imgRef = ref(storage, filename);

    const streamedImg = await uploadBytes(imgRef, img.buffer);

    await ProductImg.create({
      productId,
      imgUrl: streamedImg.metadata.fullPath,
    });
  });

  await Promise.all(imgsPromises);
};

const getProductsImgsUrls = async (products) => {
  const productsWithImgsPromises = products.map(async (product) => {
    const productImgsPromises = product.productimgs.map(async (productImg) => {
      const imgRef = ref(storage, productImg.imgUrl);
      const imgUrl = await getDownloadURL(imgRef);

      productImg.imgUrl = imgUrl;
      return productImg;
    });

    const productImgs = await Promise.all(productImgsPromises);

    product.productImgs = productImgs;
    return product;
  });

  return await Promise.all(productsWithImgsPromises);
};

module.exports = { storage, uploadProductImgs, getProductsImgsUrls };
