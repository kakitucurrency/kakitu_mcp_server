const { KakituTransactions } = require('../utils/kakitu-transactions');

class KeyManager {
    constructor(config) {
        this.kakituTransactions = new KakituTransactions({}, config);
    }

    async generateKeyPair() {
        const wallet = await this.kakituTransactions.generateWallet();
        return {
            publicKey: wallet.publicKey,
            privateKey: wallet.privateKey,
            address: wallet.address
        };
    }
}

module.exports = { KeyManager }; 