import crypto from 'crypto'

type DecryptAES = (encryptedData: string) => any

const decryptAES: DecryptAES = encryptedData => {
    // Instantiate decipher algo
    const algorithm = 'aes-128-cbc'
    const decipher = crypto.createDecipheriv(
        algorithm,
        process.env.SERVICE_ENCRYPTION_KEY as string,
        process.env.SERVICE_ENCRYPTION_IV as string
    )

    // Decipher request
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8')
    decrypted += decipher.final('utf8')

    return JSON.parse(decrypted)
}

export default decryptAES
