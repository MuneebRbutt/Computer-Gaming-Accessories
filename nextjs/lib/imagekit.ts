
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'place_holder_public_key',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'place_holder_private_key',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/place_holder'
});

export default imagekit;
