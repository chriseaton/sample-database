const Address = require('./schema/address.js');
const Customer = require('./schema/customer.js');
const Order = require('./schema/order.js');
const OrderProduct = require('./schema/order-product.js');
const Product = require('./schema/product.js');
const Role = require('./schema/role.js');
const User = require('./schema/user.js');
const Theme = require('./schema/theme.js');

class Dataset {
    constructor() {

        /**
         * @type {Array.<Address>}
         */
        this.addresses = [];

        /**
         * @type {Array.<Customer>}
         */
        this.customers = [];

        /**
         * @type {Array.<Order>}
         */
        this.orders = [];

        /**
         * @type {Array.<OrderProduct>}
         */
        this.orderProducts = [];

        /**
         * @type {Array.<Product>}
         */
        this.products = [];

        /**
         * @type {Array.<Role>}
         */
        this.roles = [];

        /**
         * @type {Array.<User>}
         */
        this.users = [];

        /**
         * @type {Array.<Theme>}
         */
        this.themes = [];
    }

    /**
     * Returns all dataset schema class objects and their resulting data property names in generation order.
     * @returns {Map<Function, String>}
     */
    schemas() {
        return new Map([
            [Product, 'products'],
            [Address, 'addresses'],
            [Customer, 'customers'],
            [Order, 'orders'],
            [OrderProduct, 'orderProducts'],
            [Role, 'roles'],
            [User, 'users'],
            [Theme, 'themes']
        ])
    }

}

module.exports = Dataset;