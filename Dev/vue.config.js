module.exports = {
    devServer: {
        port: 9080,
        proxy: "http://localhost:9085"
    }
}