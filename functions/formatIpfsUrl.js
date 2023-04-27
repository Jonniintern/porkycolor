const formatIpfsUrl = (ipfsUri) => {
  return ipfsUri
    .replaceAll("/", "-")
    .replace("ipfs:--", "https://images.cnft.tools/ipfs/");

  // return ipfsUri.replace('ipfs://', 'https://ipfs.blockfrost.dev/ipfs/')
  // return ipfsUri.replace('ipfs://', 'https://image-optimizer.jpgstoreapis.com/')
};

export default formatIpfsUrl;
