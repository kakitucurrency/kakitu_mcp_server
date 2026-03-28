const { KakituTransactions } = require('../utils/kakitu-transactions');

class KeyManager {
    constructor(config) {
        this.nanoTransactions = new KakituTransactions({}, config);
    }

    async generateKeyPair() {
        const wallet = await this.nanoTransactions.generateWallet();
        return {
            publicKey: wallet.publicKey,
            privateKey: wallet.privateKey,
            address: wallet.address
        };
    }
}

module.exports = { KeyManager }; 