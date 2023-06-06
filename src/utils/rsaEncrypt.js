import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0aaRvba0ckpkUS2JfnFW\n' +
  'BuLnJVlT++nWC+QZeyg9JST5sHe3i8sdK+NKwHeIEIT73c/L+UOV1sxDPbWGlWaq\n' +
  '5SMAFINOQomUjdkGFBiBmBS9I6zOy4v7U3BjP3YFWPioZV9oTDt/zYqWndIhJBRv\n' +
  'jY79z5KavgmL86ubwva7tt38MQFV1VdthopHGWOwPlHRAyb2z+52oP2E4XHcqdXZ\n' +
  'GzvXgVvAWOFR1l/ZrInDNUIn8X4iBKEl4DzyDTR/EiO/U9xNLyhMb7L/5WUr1UdS\n' +
  'pQw8R4mnW9FI4DyrG7E7xA/04t6vhDFNO00DHycFqOgGNz9HRv09FErGfKs74dQU\n' +
  'rwIDAQAB'

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

