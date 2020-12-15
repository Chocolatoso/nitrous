import SSC from 'sscjs';
const ssc = new SSC('https://steemapi.cryptoempirebot.com/rpc');
import { api } from '@steemit/steem-js';

async function getScotHolder(symbol, cnt, offset) {
    return new Promise((resolve, reject) => {
        let holders = new Array();
        ssc.find(
            'tokens',
            'balances',
            { symbol: symbol },
            cnt,
            offset,
            [],
            async (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }

                for (const result of results) {
                    holders.push(result);
                }

                if (results.length == cnt) {
                    const holder = await getScotHolder(
                        symbol,
                        cnt,
                        offset + cnt
                    );
                    for (const result of holder) {
                        holders.push(result);
                    }
                }

                resolve(holders);
            }
        );
    });
}

var mainnode = {
    name: 'main_node',
    account: 'sct.swap',
    tokens: ['KRWP', 'ORG', 'SVC', 'STEEM', 'SCT', 'SCTM', 'HIVEP', 'ZZAN'],
    liquidity_token: [
        'KPORG',
        'KPSVC',
        'KPSTEEM',
        'KPSCT',
        'KPSCTM',
        'STEEMHIVE',
        'ZZANSTEEM',
    ],
};

var subnode = [
    {
        name: 'kporg',
        account: 'sct.kporg',
        tokens: ['KRWP', 'ORG'],
        liquidity_token: 'KPORG',
    },
    {
        name: 'kpsvc',
        account: 'sct.kpsvc',
        tokens: ['KRWP', 'SVC'],
        liquidity_token: 'KPSVC',
    },
    {
        name: 'kpsteem',
        account: 'sct.kpsteem',
        tokens: ['KRWP', 'STEEM'],
        liquidity_token: 'KPSTEEM',
    },
    {
        name: 'kpsct',
        account: 'sct.kpsct',
        tokens: ['KRWP', 'SCT'],
        liquidity_token: 'KPSCT',
    },
    {
        name: 'kpsctm',
        account: 'sct.kpsctm',
        tokens: ['KRWP', 'SCTM'],
        liquidity_token: 'KPSCTM',
    },
    {
        name: 'steemhive',
        account: 'sct.pay',
        tokens: ['STEEM', 'HIVEP'],
        liquidity_token: 'STEEMHIVE',
    },
    {
        name: 'zzansteem',
        account: 'zzansteem',
        tokens: ['STEEM', 'ZZAN'],
        liquidity_token: 'ZZANSTEEM',
    },
];

class swapConfig {
    constructor() {
        // fee
        this.swap_fee = 3.0;
        this.nodes = subnode;
        this.mainNode = mainnode;

        this.tokens = [];
        this.tokens.push({
            id: 'steem',
            name: 'STEEM',
            fullname: 'STEEM',
            ico: '/images/tokens/steem.png',
        });
        this.tokens.push({
            id: 'krwp',
            name: 'KRWP',
            fullname: '1000 KRW Pegged',
            ico: '/images/tokens/krwp.png',
        });
        this.tokens.push({
            id: 'sct',
            name: 'SCT',
            fullname: 'SteemCoinpan Token',
            ico: '/images/tokens/sct.png',
        });
        this.tokens.push({
            id: 'sctm',
            name: 'SCTM',
            fullname: 'SCT Miner',
            ico: '/images/tokens/sctm.png',
        });
        this.tokens.push({
            id: 'hivep',
            name: 'HIVEP',
            fullname: 'HIVE Pegged',
            ico: '/images/tokens/hive.png',
        });
        this.tokens.push({
            id: 'zzan',
            name: 'ZZAN',
            fullname: 'Steemzzang Token',
            ico: '/images/tokens/zzan.png',
        });
        this.tokens.push({
            id: 'svc',
            name: 'SVC',
            fullname: 'Steem Vote Coin',
            ico: '/images/tokens/svc.png',
        });
        this.tokens.push({
            id: 'org',
            name: 'ORG',
            fullname: 'Orange Token',
            ico: '/images/tokens/org.png',
        });
    }

    floorNumberWithNumber(num, pow) {
        var n = Math.pow(10, pow);
        var _num = parseFloat(num);
        _num = Math.floor(_num * n) / n;
        _num = _num.toFixed(pow);
        return _num;
    }

    floorNumber(num) {
        var _num = parseFloat(num);
        _num = Math.floor(_num * 1000) / 1000;
        _num = _num.toFixed(3);
        return _num;
    }

    getSteemBalance(account) {
        return new Promise((resolve, reject) => {
            api.getAccounts([account], function(err, response) {
                console.log(response[0]);
                if (err) reject(err);
                console.log(response[0].balance);
                var steem_balance = response[0].balance.split(' ')[0];
                console.log(steem_balance);
                resolve(steem_balance);
            });
        });
    }

    getSBDBalance(account) {
        return new Promise((resolve, reject) => {
            api.getAccounts([account], function(err, response) {
                if (err) reject(err);
                resolve(response[0].sbd_balance.split[' '][0]);
            });
        });
    }

    getTokenBalance(account, symbol) {
        if (symbol == 'STEEM') return this.getSteemBalance(account);
        else if (symbol == 'SBD') return this.getSBDBalance(account);
        else {
            return new Promise((resolve, reject) => {
                ssc.findOne(
                    'tokens',
                    'balances',
                    { account, symbol },
                    (err, result) => {
                        if (err) reject(err);
                        // console.log(result)
                        if (result == null) resolve('0.0');
                        else resolve(result.balance);
                    }
                );
            });
        }
    }

    findNodes(input_token, output_token) {
        var first_node = this.findNode(input_token, 'KRWP');
        var second_node = this.findNode('KRWP', output_token);
        return [first_node, second_node];
    }

    findNode(input_token, output_token) {
        var validNode = null;
        for (const node of this.nodes) {
            var one = node.tokens.find(token => token == input_token);
            var two = node.tokens.find(token => token == output_token);
            if (one != undefined && two != undefined && one != two) {
                validNode = node;
                break;
            }
        }
        return validNode;
    }

    async calculateRemoveAmount(
        input_token,
        user_account,
        output_token = 'KRWP'
    ) {
        var validNode = this.findNode(input_token, output_token);
        if (validNode == null) return 0;

        var balance = await Promise.all([
            this.getTokenBalance(validNode.account, input_token),
            this.getTokenBalance(validNode.account, output_token),
            this.getTokenBalance(validNode.account, validNode.liquidity_token),
            this.getLiquidityTokenAllBalance(
                validNode.liquidity_token,
                validNode.account
            ),
            this.getTokenBalance(user_account, validNode.liquidity_token),
        ]);

        var rate = 1 / balance[1]; // krwp
        var exchange_rate = rate * balance[0]; //1 krwp = xx token
        exchange_rate = this.floorNumberWithNumber(exchange_rate, 5);

        var rate_remove = 1 / balance[3]; //  1 / all_token
        var rate_input_token = rate_remove * balance[0];
        var rate_output_token = rate_remove * balance[1];

        var liquidity_token_all = balance[3];
        var liquidity_token_user = balance[4] * 1;
        return {
            node_token_balance: balance[0],
            node_krwp_balance: balance[1],
            exchange_rate: exchange_rate,
            remove_rate: rate_remove,
            rate_input_token: rate_input_token,
            rate_output_token: rate_output_token,
            liquidity_token_all: liquidity_token_all,
            liquidity_token_user: liquidity_token_user,
            liquidity_token_symbol: validNode.liquidity_token,
        };
    }

    async calculateDepositAmount(input_token, output_token, user_account) {
        var validNode = this.findNode(input_token, output_token);
        if (validNode == null) return 0;

        var balance = await Promise.all([
            this.getTokenBalance(validNode.account, input_token),
            this.getTokenBalance(validNode.account, output_token),
            this.getLiquidityTokenAllBalance(
                validNode.liquidity_token,
                validNode.account
            ),
            this.getTokenBalance(user_account, validNode.liquidity_token),
        ]);
        var assume_krwp = 1;
        var rate = assume_krwp / balance[0];
        var exchange_rate = rate * balance[1];
        exchange_rate = this.floorNumberWithNumber(exchange_rate, 5);
        console.log('exchange_rate', exchange_rate);

        var liquidity_token_all = balance[2];
        var liquidity_token = rate * liquidity_token_all;
        var liquidity_token_user = balance[3] * 1;

        return {
            node_input_balance: balance[0],
            node_output_balance: balance[1],
            exchange_rate: exchange_rate,
            liquidity_token: liquidity_token,
            liquidity_token_all: liquidity_token_all,
            liquidity_token_user: liquidity_token_user,
            liquidity_token_symbol: validNode.liquidity_token,
        };
    }

    async calculateExchangeAmount2(input_token, output_token, input_amount) {
        var result_one = await this.calculateExchangeAmount(
            input_token,
            'KRWP',
            input_amount
        );
        var result_two = await this.calculateExchangeAmount(
            'KRWP',
            output_token,
            result_one.estimated_output_amount
        );

        return {
            estimated_output_amount: result_two.estimated_output_amount,
            node_output_balance: result_two.node_output_balance,
            exchange_rate:
                result_two.estimated_output_amount_origin / input_amount,
        };
    }

    async calculateExchangeAmount(
        input_token,
        output_token,
        input_amount,
        swap_fee = 3
    ) {
        var validNode = this.findNode(input_token, output_token);
        if (validNode == null) return 0;
        console.log(validNode);
        var balance = await Promise.all([
            this.getTokenBalance(validNode.account, input_token),
            this.getTokenBalance(validNode.account, output_token),
        ]);
        // input, output balance
        console.log('calculateExchangeAmount', balance);
        var alpha = input_amount / balance[0];

        var rate_fee = (100.0 - swap_fee) / 100.0;
        var estimated_output_amount =
            balance[1] * (alpha * rate_fee) / (1 + alpha * rate_fee); // transfer this to user
        var exchange_rate = estimated_output_amount / input_amount;
        var estimated_output_amount_origin = estimated_output_amount;
        // exchange_rate = this.floorNumberWithNumber(exchange_rate, 5);
        estimated_output_amount = this.floorNumber(estimated_output_amount);
        return {
            estimated_output_amount_origin,
            estimated_output_amount,
            node_output_balance: balance[1],
            exchange_rate,
        };
    }

    async getHolder(symbol) {
        return new Promise(async (resolve, reject) => {
            await getScotHolder(symbol, 500, 0)
                .then(results => {
                    resolve(results);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    async getLiquidityTokenAllBalance(symbol, node_account) {
        var all = await this.getHolder(symbol);
        all = all.filter(one => one.account != node_account);
        var circulated_balance = 0;
        for (const one of all) {
            circulated_balance = circulated_balance + one.balance * 1.0;
        }
        return circulated_balance;
    }
}

export default swapConfig;
