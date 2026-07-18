const OrderStatus = Object.freeze({
    PENDING: "PENDING",
    PLACED: "PLACED",
    CONFIRMED: "CONFIRMED",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED"
})

module.exports = OrderStatus;