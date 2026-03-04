const OrderStatus = Object.freeze({
    PENDING: "PENDING",
    PLACED: "PLACED",
    CONFIRMED: "CONFIRMED",
    SHIPPED: "SHIPPED",
    DELIVERED: "SHIPPED",
    CANCELLED: "CANCELLED"
})

module.exports = OrderStatus;