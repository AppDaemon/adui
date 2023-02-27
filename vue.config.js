module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/aui/'
        : '/',
    outputDir: "../appdaemon/appdaemon/assets/aui",
    filenameHashing: false,
    transpileDependencies: [
        'vuetify'
    ]
}
